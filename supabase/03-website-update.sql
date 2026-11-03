-- PriceRight Tech Ltd: website, catalogue setup, contact messages and email receipts.
-- Run once in Supabase: SQL Editor > New query > paste > Run. Safe to run again.

-- 1. The online store may read banners, published blog posts and categories ----
drop policy if exists public_settings on public.settings;
create policy public_settings on public.settings for select to anon, authenticated
  using (key in ('areas','store','banners','blog','categories'));

-- 2. Starting values -------------------------------------------------------------
update public.settings set data = jsonb_set(data, '{name}', '"PriceRight Tech Ltd"')
  where key = 'store' and data->>'name' = 'Top League Electronics';
insert into public.settings(key, data) values
  ('categories', '["Laptops","Desktops","Monitors","Phones","Tablets","CCTV & Security","Networking","Storage","Printers","Accessories"]'),
  ('sku_types', '[{"name":"Laptops","prefix":"LAP"},{"name":"Desktops","prefix":"DSK"},{"name":"Monitors","prefix":"MON"},{"name":"Phones","prefix":"PHN"},{"name":"Tablets","prefix":"TAB"},{"name":"CCTV cameras","prefix":"CCTV"},{"name":"DVR and NVR recorders","prefix":"REC"},{"name":"Hard drives","prefix":"HDD"},{"name":"Networking","prefix":"NET"},{"name":"Printers","prefix":"PRN"},{"name":"Accessories","prefix":"ACC"}]'),
  ('banners', '[]'),
  ('blog', '[]'),
  ('blog_drafts', '[]')
on conflict (key) do nothing;

-- 3. Contact form messages ------------------------------------------------------
create table if not exists public.messages(
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.messages enable row level security;
drop policy if exists staff_read on public.messages;
create policy staff_read on public.messages for select to authenticated using (public.my_role() is not null);

create or replace function public.contact_message(p jsonb) returns text
language plpgsql security definer set search_path = public as $$
declare k text; recent int;
begin
  if length(trim(coalesce(p->>'name',''))) < 2 then raise exception 'Add your name.'; end if;
  if length(trim(coalesce(p->>'message',''))) < 5 then raise exception 'Write your message.'; end if;
  if length(coalesce(p->>'message','')) > 4000 or length(coalesce(p->>'name','')) > 120 then raise exception 'That message is too long.'; end if;
  if public.norm_phone(p->>'phone') !~ '^0\d{8,9}$' and coalesce(p->>'email','') !~ '^\S+@\S+\.\S+$' then
    raise exception 'Add a phone number or email so we can reply.';
  end if;
  select count(*) into recent from public.messages where updated_at > now() - interval '10 minutes';
  if recent > 30 then raise exception 'We are receiving a lot of messages. Please call or WhatsApp us instead.'; end if;
  k := 'M-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(md5(random()::text), 1, 5));
  insert into public.messages(key, data) values (k, jsonb_build_object(
    'id', k, 'name', left(trim(p->>'name'), 120), 'phone', left(coalesce(p->>'phone',''), 30), 'email', left(coalesce(p->>'email',''), 160),
    'topic', left(coalesce(p->>'topic','General'), 60), 'message', left(p->>'message', 4000), 'status', 'new',
    't', (extract(epoch from now()) * 1000)::bigint));
  return k;
end $$;
grant execute on function public.contact_message(jsonb) to anon, authenticated;

create or replace function public.message_status(k text, s text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if public.my_role() is null then raise exception 'FORBIDDEN:messages'; end if;
  if s not in ('new','done') then raise exception 'Unknown status'; end if;
  update public.messages set data = data || jsonb_build_object('status', s, 'by', auth.jwt()->>'email'), updated_at = now() where key = k;
end $$;
grant execute on function public.message_status(text, text) to authenticated;

do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when others then null; end $$;

-- 4. Online orders keep the email given at checkout (used for the order email) ---
create or replace function public.place_order(p jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  it jsonb; pr jsonb; av int; sub numeric := 0; fee numeric; ar jsonb;
  cid text; ono text; items jsonb := '[]'::jsonb; ph text := public.norm_phone(p->>'phone');
  now_ms bigint := (extract(epoch from now()) * 1000)::bigint;
begin
  if jsonb_array_length(coalesce(p->'items','[]'::jsonb)) = 0 then raise exception 'Your cart is empty.'; end if;
  if length(ph) < 9 or coalesce(trim(p->>'name'),'') = '' then raise exception 'Add your name and phone number.'; end if;
  select x into ar from public.settings s, jsonb_array_elements(s.data) x where s.key = 'areas' and x->>'name' = p->>'area';
  if ar is null then raise exception 'Choose a delivery area.'; end if;
  fee := coalesce((ar->>'fee')::numeric, 0);
  for it in select * from jsonb_array_elements(p->'items') loop
    select data into pr from public.products where key = it->>'pid' and coalesce((data->>'active')::boolean, true);
    if pr is null then raise exception 'A product in your cart is no longer available.'; end if;
    select (x->>'available')::int into av from jsonb_array_elements(public.public_catalog()) x where x->>'id' = it->>'pid';
    if coalesce(av,0) < (it->>'qty')::int then raise exception 'Only % of % left in stock.', coalesce(av,0), pr->>'name'; end if;
    sub := sub + (pr->>'price')::numeric * (it->>'qty')::int;
    items := items || jsonb_build_object('pid', it->>'pid', 'qty', (it->>'qty')::int, 'price', (pr->>'price')::numeric);
  end loop;
  select key into cid from public.customers where public.norm_phone(data->>'phone') = ph limit 1;
  if cid is null then
    cid := 'C' || upper(substr(md5(random()::text), 1, 8));
    insert into public.customers(key, data) values (cid, jsonb_build_object(
      'id', cid, 'name', trim(p->>'name'), 'phone', p->>'phone', 'email', coalesce(p->>'email',''),
      'location', concat_ws(', ', p->>'area', nullif(p->>'landmark','')), 'guest', true));
  elsif coalesce(p->>'email','') ~ '^\S+@\S+\.\S+$' then
    update public.customers set data = data || jsonb_build_object('email', p->>'email'), updated_at = now()
      where key = cid and coalesce(data->>'email','') = '';
  end if;
  ono := 'ORD-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(md5(random()::text), 1, 4));
  insert into public.orders(key, data) values (ono, jsonb_build_object(
    'no', ono, 'custId', cid, 'items', items, 'area', p->>'area', 'fee', fee, 'landmark', coalesce(p->>'landmark',''), 'email', left(coalesce(p->>'email',''), 160),
    'status', case when p->>'payment' = 'paystack' then 'paid' else 'pod' end,
    'payment', coalesce(p->>'payment','pod'), 'ref', coalesce(p->>'ref',''),
    't', now_ms, 'serials', '[]'::jsonb, 'rider', '', 'saleId', null, 'subtotal', sub, 'total', sub + fee));
  insert into public.audit(key, data) values ('A' || ono, jsonb_build_object(
    'id', 'A' || ono, 't', now_ms, 'by', 'Customer', 'action', 'Online order placed', 'detail', ono));
  return jsonb_build_object('no', ono, 'total', sub + fee);
end $$;

-- 5. Email receipts: one row per email sent, so nothing is sent twice ------------
create table if not exists public.email_log(
  key text primary key,
  sent_to text,
  created_at timestamptz not null default now()
);
alter table public.email_log enable row level security;
