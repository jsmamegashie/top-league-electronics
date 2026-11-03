// PriceRight Tech Ltd: emails a receipt (in-shop or online sale) or an order confirmation.
// Deploy as the Supabase Edge Function "send-receipt" with JWT verification turned off,
// then add these secrets: RESEND_API_KEY, MAIL_FROM (e.g. "PriceRight Tech <receipts@yourdomain.com>"),
// and optionally SITE_URL. Each receipt is sent once, only to the email saved on the customer or order.
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const out = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const money = (n: unknown) => 'GH₵ ' + Number(n || 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const day = (t: number) => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Accra' });
const when = (t: number) => new Date(t).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Accra' });
const okEmail = (e: string) => /^\S+@\S+\.\S+$/.test(e || '');

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return out({ sent: false, reason: 'method' }, 405);
  const KEY = Deno.env.get('RESEND_API_KEY'), FROM = Deno.env.get('MAIL_FROM');
  const SITE = (Deno.env.get('SITE_URL') || 'https://top-league-electronics.vercel.app').replace(/\/$/, '');
  if (!KEY || !FROM) return out({ sent: false, reason: 'not_configured' });

  let body: { sale?: string; order?: string };
  try { body = await req.json() } catch { return out({ sent: false, reason: 'bad_request' }, 400) }
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const row = async (table: string, key: string) => (await db.from(table).select('data').eq('key', key).maybeSingle()).data?.data;

  const store = (await row('settings', 'store')) || { name: 'PriceRight Tech Ltd' };
  let kind: 'sale' | 'order', id: string, rec: any;
  if (body.sale) { kind = 'sale'; id = String(body.sale); rec = await row('sales', id) }
  else if (body.order) { kind = 'order'; id = String(body.order); rec = await row('orders', id) }
  else return out({ sent: false, reason: 'bad_request' }, 400);
  if (!rec) return out({ sent: false, reason: 'not_found' }, 404);
  if (kind === 'sale' && rec.status === 'voided') return out({ sent: false, reason: 'voided' });

  const cust = (await row('customers', rec.custId)) || {};
  const to = kind === 'order' && okEmail(rec.email) ? rec.email : cust.email;
  if (!okEmail(to)) return out({ sent: false, reason: 'no_email' });

  // Claim the send first so two calls can never email the same receipt twice.
  const logKey = `${kind}:${id}`;
  const { error: claim } = await db.from('email_log').insert({ key: logKey, sent_to: to });
  if (claim) return out({ sent: false, reason: 'already_sent' });

  const pids = [...new Set((rec.items || []).map((i: any) => i.pid))];
  const { data: prows } = await db.from('products').select('key,data').in('key', pids.length ? pids : ['-']);
  const pname = (pid: string) => (prows || []).find((r: any) => r.key === pid)?.data?.name || 'Item';

  const lines = kind === 'sale'
    ? rec.items.map((i: any) => `<tr><td style="padding:10px 0;border-bottom:1px solid #EDF0F4"><b>${esc(pname(i.pid))}</b><br><span style="color:#5B6478;font-size:13px">Serial ${esc(i.serial)}<br>Warranty to ${day(i.wEnd)}</span></td><td style="padding:10px 0;border-bottom:1px solid #EDF0F4;text-align:right;white-space:nowrap;vertical-align:top">${money(i.price)}</td></tr>`).join('')
    : rec.items.map((i: any) => `<tr><td style="padding:10px 0;border-bottom:1px solid #EDF0F4"><b>${esc(pname(i.pid))}</b><br><span style="color:#5B6478;font-size:13px">Quantity ${i.qty}</span></td><td style="padding:10px 0;border-bottom:1px solid #EDF0F4;text-align:right;white-space:nowrap;vertical-align:top">${money(i.price * i.qty)}</td></tr>`).join('');
  const sub = kind === 'sale' ? rec.subtotal : rec.subtotal ?? rec.items.reduce((a: number, i: any) => a + i.price * i.qty, 0);
  const total = rec.total ?? sub + (rec.fee || 0);
  const tot = (l: string, v: string, b = false) => `<tr><td style="padding:4px 0;${b ? 'font-weight:700;font-size:16px' : 'color:#5B6478'}">${l}</td><td style="padding:4px 0;text-align:right;${b ? 'font-weight:700;font-size:16px' : ''}">${v}</td></tr>`;
  const heading = kind === 'sale' ? `Receipt ${esc(rec.id)}` : `Order ${esc(rec.no)} received`;
  const intro = kind === 'sale'
    ? `Thank you for shopping with us, ${esc((cust.name || '').split(' ')[0])}. Keep this email: it is your receipt and your warranty record.`
    : `Thank you, ${esc((cust.name || '').split(' ')[0])}. We have your order and will call you to confirm delivery. You'll get your receipt by email when it is packed.`;
  const pay = kind === 'sale'
    ? (rec.payStatus === 'due' ? tot('Payment', 'Due on delivery') : (rec.pay || []).filter((p: any) => p.method !== 'refund').map((p: any) => tot(esc(String(p.method).replace('momo', 'MoMo').replace(/^./, (c: string) => c.toUpperCase())), money(p.amount))).join(''))
    : tot('Payment', rec.payment === 'paystack' ? 'Paid online' : 'Pay on delivery');

  const html = `<!doctype html><html><body style="margin:0;background:#F4F6FA;font-family:Arial,Helvetica,sans-serif;color:#121A2C">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FA;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden">
<tr><td style="background:#0B1B3F;padding:22px 28px"><img src="${SITE}/logo-mark.png" width="44" height="44" alt="" style="vertical-align:middle;border-radius:10px"><span style="color:#fff;font-size:18px;font-weight:700;vertical-align:middle;margin-left:12px">${esc(store.name)}</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 8px;font-size:22px">${heading}</h1>
<p style="margin:0 0 20px;color:#5B6478;line-height:1.5">${intro}</p>
<p style="margin:0 0 16px;font-size:13px;color:#5B6478">${when(rec.t)}${kind === 'sale' && rec.orderNo ? ` · Order ${esc(rec.orderNo)}` : ''}${kind === 'sale' ? ` · Served by ${esc(rec.staff)}` : ''}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${lines}</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px">
${tot('Subtotal', money(sub))}${rec.discount ? tot('Discount', '-' + money(rec.discount)) : ''}${rec.fee ? tot('Delivery', money(rec.fee)) : ''}${tot('Total', money(total), true)}${pay}
</table>
${kind === 'sale' ? `<p style="margin:22px 0 0;padding:14px 16px;background:#FFF6D6;border-radius:10px;font-size:13px;line-height:1.5">For a return or warranty claim, use the serial number above with the phone number or email you bought with, at ${SITE}/#/returns</p>` : `<p style="margin:22px 0 0"><a href="${SITE}/#/track?no=${encodeURIComponent(rec.no)}" style="display:inline-block;background:#F5B400;color:#0B1B3F;font-weight:700;padding:12px 20px;border-radius:10px;text-decoration:none">Track your order</a></p>`}
</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid #EDF0F4;font-size:12px;color:#8A92A3;line-height:1.6">${esc(store.name)}${store.branch ? ', ' + esc(store.branch) : ''}${store.address ? '<br>' + esc(store.address) : ''}${store.phone ? '<br>' + esc(store.phone) : ''}<br><a href="${SITE}/#/privacy" style="color:#8A92A3">Privacy policy</a></td></tr>
</table></td></tr></table></body></html>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject: kind === 'sale' ? `Your receipt ${rec.id} from ${store.name}` : `We've got your order ${rec.no}`, html, reply_to: okEmail(store.email) ? store.email : undefined }),
  });
  if (!r.ok) { await db.from('email_log').delete().eq('key', logKey); return out({ sent: false, reason: 'provider', detail: (await r.text()).slice(0, 300) }, 502) }
  return out({ sent: true });
});
