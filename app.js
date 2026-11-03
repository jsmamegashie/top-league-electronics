'use strict';
/* PriceRight Tech Ltd — store + staff app */
const CFG = window.TLE_CONFIG || {};
const REMOTE = !!(CFG.supabaseUrl && CFG.supabaseAnonKey);
const IS_STAFF = location.pathname.replace(/\/+$/, '').startsWith('/staff');

/* ================= icons & art ================= */
const IC = {
home:'<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
receipt:'<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
truck:'<path d="M2 6h12v10H2zM14 10h4l4 4v2h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
inbox:'<path d="M3 13h5l1 3h6l1-3h5"/><path d="M5.5 5h13L21 13v6H3v-6z"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
count:'<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
tool:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
users:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4.1a4 4 0 0 1 0 7.8M22 21a7 7 0 0 0-4-6.3"/>',
chart:'<path d="M3 3v18h18"/><path d="M8 16v-3M13 16V9M18 16V6"/>',
sync:'<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
doc:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
scan:'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 8v8M10 8v8M14 8v8M17 8v8"/>',
camera:'<path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/>',
printer:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
tag:'<path d="M3 12V3h9l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
wifi:'<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8"/>',
wifioff:'<path d="M2 2l20 20M8.5 16a5 5 0 0 1 7 0M5 12.5a10 10 0 0 1 4.6-2.6M14.6 10A10 10 0 0 1 19 12.5M2 9a15 15 0 0 1 4.5-3M11 4.8A15 15 0 0 1 22 9"/><circle cx="12" cy="19.5" r=".8"/>',
cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12h11.2L21 7H6"/>',
shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
msg:'<path d="M21 12a8 8 0 0 1-11.8 7L3 21l2-6A8 8 0 1 1 21 12z"/>',
mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
layers:'<path d="M12 3 2 8l10 5 10-5z"/><path d="m2 13 10 5 10-5M2 17.5l10 5 10-5"/>',
trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
userplus:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>',
cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
pin:'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
chev:'<path d="m9 6 6 6-6 6"/>',back:'<path d="m15 6-6 6 6 6"/>',
eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
store:'<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>',
external:'<path d="M14 3h7v7M21 3l-9 9"/><path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>'
};
const ic = (n, s = 18, w = 1.75) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;
const ART = {
Laptops:'<rect x="22" y="12" width="76" height="48" rx="3"/><rect x="27" y="17" width="66" height="38" rx="1" fill="#DCE6FB" stroke="none"/><path d="M12 64h96l-6 8H18z"/><path d="M52 68h16"/>',
Phones:'<rect x="44" y="6" width="32" height="64" rx="6"/><rect x="48" y="12" width="24" height="50" rx="2" fill="#DCE6FB" stroke="none"/><path d="M56 9h8"/><circle cx="60" cy="66" r="1.2"/>',
'CCTV & Security':'<path d="M30 20h60v6H30z"/><path d="M36 26c0 20 10 34 24 34s24-14 24-34"/><circle cx="60" cy="40" r="11" fill="#DCE6FB"/><circle cx="60" cy="40" r="5"/><path d="M52 66h16"/>',
Storage:'<rect x="34" y="10" width="52" height="60" rx="6"/><circle cx="60" cy="36" r="14" fill="#DCE6FB"/><circle cx="60" cy="36" r="3"/><path d="M42 60h10"/>',
Accessories:'<rect x="16" y="30" width="18" height="12" rx="3"/><path d="M34 36h8c14 0 14 20 30 20h14"/><rect x="86" y="50" width="18" height="12" rx="3"/><path d="M10 36h6M104 56h6"/>',
Monitors:'<rect x="14" y="8" width="92" height="54" rx="3"/><rect x="19" y="13" width="82" height="44" rx="1" fill="#DCE6FB" stroke="none"/><path d="M60 62v8M44 72h32"/>',
Networking:'<rect x="16" y="44" width="88" height="20" rx="4"/><path d="M28 54h.01M38 54h.01M48 54h.01"/><path d="M80 54h14"/><path d="M36 44 30 16M84 44l6-28"/>',
Printers:'<path d="M36 26V8h48v18"/><rect x="16" y="26" width="88" height="30" rx="4"/><rect x="36" y="46" width="48" height="26" fill="#DCE6FB"/><path d="M90 36h.01"/>',
Other:'<path d="M60 10 98 30v32L60 72 22 62V30z"/><path d="M22 30l38 14 38-14M60 44v28"/>'
};
const artKey = c => { c = String(c || ''); if (ART[c]) return c; const m = [[/laptop|notebook|macbook/i, 'Laptops'], [/phone|tablet|ipad/i, 'Phones'], [/cctv|camera|secur|dvr|nvr/i, 'CCTV & Security'], [/stor|drive|hdd|ssd|flash|memory/i, 'Storage'], [/monitor|desktop|screen|tv|display/i, 'Monitors'], [/network|router|switch|wifi/i, 'Networking'], [/print|scan/i, 'Printers'], [/access|cable|charger|mouse|keyboard|bag/i, 'Accessories']].find(([r]) => r.test(c)); return m ? m[1] : 'Other' };
const art = (p, w = 120, h = 80) => `<svg width="${w}" height="${h}" viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ART[artKey(p && p.cat)]}</svg>`;
const pic = (p, w, h) => p && p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : art(p, w, h);

/* ================= helpers ================= */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => 'GH₵ ' + Number(n || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const DAY = 864e5;
const fmtD = t => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtT = t => new Date(t).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const addMonths = (t, m) => { const d = new Date(t); d.setMonth(d.getMonth() + Number(m || 0)); return d.getTime() };
const sameDay = (a, b = Date.now()) => new Date(a).toDateString() === new Date(b).toDateString();
const startOfDay = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime() };
const normPhone = p => { let d = String(p || '').replace(/\D/g, ''); if (d.startsWith('233')) d = '0' + d.slice(3); return d };
const normSerial = s => String(s || '').toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9\-_.\/:#]/g, '');
const rnd = n => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'[b % 34]).join('');
const ymd = () => { const d = new Date(); return String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') };
const uid = p => `${p}-${ymd()}-${rnd(4)}`;
const initials = n => String(n || '?').split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('');
const debounce = (f, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => f(...a), ms) } };
async function sha(s) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('') }

const idb = (() => {
  let p; const open = () => p || (p = new Promise((res, rej) => { const r = indexedDB.open('tle', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error) }));
  return {
    get: async k => { try { const d = await open(); return await new Promise(r => { const q = d.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => r(q.result); q.onerror = () => r(undefined) }) } catch (e) { return undefined } },
    set: async (k, v) => { try { const d = await open(); await new Promise(r => { const t = d.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, k); t.oncomplete = r; t.onerror = r }) } catch (e) { } }
  };
})();
const ls = { get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch (e) { return d } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } }, del: k => { try { localStorage.removeItem(k) } catch (e) { } } };

/* ================= state ================= */
const COLL = ['products', 'units', 'customers', 'sales', 'orders', 'returns', 'batches', 'settings', 'audit'];
const S = { costs: {}, staff: {} }; COLL.forEach(c => S[c] = {});
const DEFAULT_SETTINGS = {
  areas: [{ name: 'Dansoman', fee: 25 }, { name: 'Osu', fee: 35 }, { name: 'East Legon', fee: 40 }, { name: 'Madina', fee: 45 }, { name: 'Kasoa', fee: 50 }, { name: 'Tema', fee: 60 }],
  riders: [],
  store: { name: 'PriceRight Tech Ltd', branch: 'Main Branch', address: 'Accra, Ghana', phone: '', whatsapp: '', email: '', receiptFooter: 'Returns and warranty claims need the serial number shown above.', hours: 'Monday to Saturday, 8:30am to 6:30pm', map: '' },
  categories: ['Laptops', 'Desktops', 'Monitors', 'Phones', 'Tablets', 'CCTV & Security', 'Networking', 'Storage', 'Printers', 'Accessories'],
  sku_types: [{ name: 'Laptops', prefix: 'LAP' }, { name: 'Desktops', prefix: 'DSK' }, { name: 'Monitors', prefix: 'MON' }, { name: 'Phones', prefix: 'PHN' }, { name: 'Tablets', prefix: 'TAB' }, { name: 'CCTV cameras', prefix: 'CCTV' }, { name: 'DVR and NVR recorders', prefix: 'REC' }, { name: 'Hard drives', prefix: 'HDD' }, { name: 'Networking', prefix: 'NET' }, { name: 'Printers', prefix: 'PRN' }, { name: 'Accessories', prefix: 'ACC' }],
  banners: [], blog: [], blog_drafts: []
};
// Offline-only accounts are not used once Supabase is connected; staff sign in with their Supabase logins.
const LOCAL_STAFF = {};
const set_ = k => k === 'store' ? { ...DEFAULT_SETTINGS.store, ...(S.settings.store || {}) } : S.settings[k] ?? DEFAULT_SETTINGS[k];
let ME = null, sb = null;
const NET = { online: navigator.onLine, outbox: [] };
const UI = { pos: null, recv: null, fr: null, count: null, salesF: { range: 'today', q: '', st: 'all' }, invF: { q: '', st: 'all' }, prodF: { q: '', cat: 'All' }, ordTab: 'pack', rep: 30, audQ: '', custQ: '', menu: false };
const resetPos = () => UI.pos = { cart: [], cust: { phone: '', name: '', email: '', location: '' }, method: 'cash', discount: '', reason: '', ref: '', split: '', tendered: '' };
const resetRecv = () => UI.recv = { supplier: '', invoice: '', pid: '', expected: '', cost: '', items: [] };
resetPos(); resetRecv();

const ROLE_NAME = { attendant: 'Shop assistant', owner: 'Shop owner', it_admin: 'IT admin' };
const OI = ['owner', 'it_admin'], O = ['owner'], IT = ['it_admin'];
const PERM = { messages: ['attendant', 'owner', 'it_admin'], cost: OI, catalog: OI, void: O, decide: O, inspect: OI, closeGap: OI, reports: OI, audit: OI, settings: OI, staffView: OI, staffEdit: IT, writeOff: O, cancelOrder: OI, unitStatus: OI, conflict: O, allSales: OI };
const can = a => !!ME && (PERM[a] || []).includes(ME.role);
const meName = () => ME ? (ME.name || ME.email.split('@')[0]) : 'Customer';

/* ================= lookups ================= */
const prod = id => S.products[id];
const pname = id => (S.products[id] || {}).name || 'Unknown product';
const unit = s => S.units[normSerial(s)];
const cust = id => S.customers[id];
const vals = c => Object.values(S[c]);
const inStock = pid => vals('units').filter(u => u.pid === pid && u.status === 'in_stock').length;
const held = pid => vals('orders').filter(o => ['paid', 'pod'].includes(o.status)).reduce((a, o) => a + o.items.filter(i => i.pid === pid).reduce((b, i) => b + Number(i.qty), 0), 0);
const avail = pid => Math.max(0, inStock(pid) - held(pid));
const unitCost = u => S.costs['u:' + u.serial] ?? S.costs['p:' + u.pid] ?? 0;
function findSaleItem(serial) { for (const s of vals('sales')) { if (s.status === 'voided') continue; const it = (s.items || []).find(i => i.serial === serial && !i.returned); if (it) return { sale: s, item: it } } return null }
function coverage(item, sale) {
  const p = prod(item.pid) || { r: 7 }, days = (Date.now() - sale.t) / DAY;
  if (days <= (p.r ?? 7)) return { k: 'window', label: `Within ${p.r ?? 7}-day return window`, c: 'g' };
  if (Date.now() <= item.wEnd) return { k: 'warranty', label: `Under warranty until ${fmtD(item.wEnd)}`, c: 'b' };
  return { k: 'expired', label: `Warranty ended ${fmtD(item.wEnd)}`, c: 'r' };
}
const isPending = id => NET.outbox.some(o => o.saleId === id);
function auditRec(action, detail) { return { id: 'A' + Date.now().toString(36) + rnd(4), t: Date.now(), by: meName(), action, detail: String(detail || '') } }
const UST = { in_stock: ['In stock', 'g'], sold: ['Sold', 'b'], returned_inspection: ['Awaiting inspection', 'a'], in_repair: ['In repair', 'a'], faulty: ['Faulty', 'r'], returned_to_supplier: ['Returned to supplier', 'm'], written_off: ['Written off', 'r'] };
const RST = { submitted: ['Awaiting device', 'a'], verified: ['Needs decision', 'b'], resolved: ['Resolved', 'g'], rejected: ['Rejected', 'r'] };
const OST = { pod: ['Pay on delivery', 'a'], paid: ['Paid online', 'a'], packed: ['Ready to send', 'b'], out: ['On the way', 'b'], delivered: ['Delivered', 'g'], cancelled: ['Cancelled', 'm'] };
const st = (t, c) => `<span class="st ${c}">${esc(t)}</span>`;
const stU = s => st((UST[s] || [s])[0], (UST[s] || [0, 'm'])[1]);
const sn = (s, k = '') => `<span class="sn ${k}"><i>S/N</i><em>${esc(s)}</em></span>`;
const saleSt = s => isPending(s.id) ? st('Waiting to sync', 'a') : s.status === 'voided' ? st('Voided', 'r') : s.status === 'conflict' ? st('Needs review', 'r') : s.payStatus === 'due' ? st('Payment due', 'a') : (s.refunds || []).length ? st('Part refunded', 'm') : st('Completed', 'g');

/* ================= data layer ================= */
const persistLocal = debounce(() => {
  const data = {}; COLL.forEach(c => data[c] = S[c]); data.costs = S.costs; data.staff = S.staff;
  idb.set(REMOTE ? 'cache:' + (ME ? ME.email : 'public') : 'data', data);
}, 250);
const saveOutbox = () => idb.set('outbox', NET.outbox);

function applyChanges(ch) {
  COLL.forEach(c => (ch[c] || []).forEach(r => { if (c === 'settings') S.settings[r.id] = r.data; else S[c][r.id] = r }));
  (ch.costs || []).forEach(c => S.costs[c.key] = Number(c.cost) || 0);
  (ch.units || []).forEach(u => { if (S.costs['u:' + u.id] == null && S.costs['p:' + u.pid] != null) S.costs['u:' + u.id] = S.costs['p:' + u.pid] });
  (ch.staff_roles || []).forEach(e => { const k = e.email.toLowerCase(); if (e.removed) delete S.staff[k]; else S.staff[k] = { ...(S.staff[k] || {}), ...e, email: k } });
  persistLocal();
}
function checkGuards(guards) {
  for (const g of guards || []) {
    const u = S.units[g.serial];
    if (g.absent) { if (u) throw new Error(`${g.serial} is already in the system (${UST[u.status][0]}).`) }
    else if (!u) throw new Error(`${g.serial} isn’t in the system.`);
    else if (!g.expect.includes(u.status)) throw new Error(`${g.serial} is ${UST[u.status][0].toLowerCase()}, so it can’t be used here.`);
  }
}
function checkPerms(ch) {
  if ((ch.products || ch.settings || ch.costs) && !can('catalog')) throw new Error('Only the shop owner or IT admin can change products and settings.');
  if (ch.staff_roles && !can('staffEdit')) throw new Error('Only the IT admin can manage staff accounts.');
  (ch.sales || []).forEach(s => { if (s.status === 'voided' && (S.sales[s.id] || {}).status !== 'voided' && !can('void')) throw new Error('Only the shop owner can void a sale.') });
  (ch.returns || []).forEach(r => { if (['resolved', 'rejected'].includes(r.status) && (S.returns[r.id] || {}).status !== r.status && !can('decide')) throw new Error('Only the shop owner can decide a return.') });
}
function toPayload(ch) {
  const p = {};
  COLL.forEach(c => { if (ch[c]) p[c] = ch[c].map(r => c === 'settings' ? { key: r.id, data: r.data } : { key: r.id, data: r }) });
  if (ch.costs) p.costs = ch.costs;
  if (ch.staff_roles) p.staff_roles = ch.staff_roles.map(({ hash, ...e }) => e);
  return p;
}
function friendlyErr(m) {
  m = String(m || '');
  const g = m.match(/GUARD:([^:]+):(\w+)/);
  if (g) return g[2] === 'exists' ? `${g[1]} is already in the system.` : g[2] === 'missing' ? `${g[1]} isn’t in the system.` : `${g[1]} is ${(UST[g[2]] || [g[2]])[0].toLowerCase()}, so it can’t be used here.`;
  if (m.includes('FORBIDDEN:void')) return 'Only the shop owner can void a sale.';
  if (m.includes('FORBIDDEN:decide')) return 'Only the shop owner can decide a return.';
  if (m.includes('FORBIDDEN:staff')) return 'Only the IT admin can manage staff accounts.';
  if (m.includes('FORBIDDEN')) return 'Your account isn’t allowed to make this change.';
  if (m.includes('NOT_STAFF')) return 'Your account doesn’t have staff access.';
  return m.replace(/^.*?ERROR:\s*/, '');
}
const isNetErr = e => /fetch|network|Load failed|NetworkError/i.test(String(e && (e.message || e)));

/* every change goes through here */
async function tx(ch, guards = [], opt = {}) {
  checkPerms(ch);
  if (!REMOTE) { checkGuards(guards); applyChanges(ch); return { ok: true } }
  if (NET.online) {
    try {
      const { error } = await sb.rpc('commit', { changes: toPayload(ch), guards });
      if (error) { if (isNetErr(error)) throw error; throw new Error(friendlyErr(error.message)) }
      applyChanges(ch); return { ok: true };
    } catch (e) { if (!isNetErr(e)) throw e; setOnline(false) }
  }
  if (!opt.offline) throw new Error('You’re offline. This needs an internet connection.');
  checkGuards(guards); applyChanges(ch);
  NET.outbox.push({ id: rnd(8), ch, guards, saleId: opt.saleId || null, t: Date.now() }); saveOutbox();
  return { ok: true, queued: true };
}
async function flushOutbox() {
  if (!REMOTE || !NET.online || !NET.outbox.length || NET.flushing) return;
  NET.flushing = true; let done = 0, conflicts = 0;
  try {
    while (NET.outbox.length) {
      const it = NET.outbox[0];
      const { error } = await sb.rpc('commit', { changes: toPayload(it.ch), guards: it.guards });
      if (error && isNetErr(error)) { setOnline(false); break }
      if (error) {
        const msg = friendlyErr(error.message);
        if (it.saleId) {
          const sale = (it.ch.sales || []).find(s => s.id === it.saleId);
          const fix = { sales: [{ ...sale, status: 'conflict', conflict: msg }], customers: it.ch.customers || [], audit: [auditRec('Offline sale needs review', `${it.saleId}: ${msg}`)] };
          await sb.rpc('commit', { changes: toPayload(fix), guards: [] }); conflicts++;
        } else toast('A change made offline couldn’t be saved: ' + msg, 'err');
      } else done++;
      NET.outbox.shift(); saveOutbox();
    }
  } finally { NET.flushing = false }
  if (done || conflicts) { await loadAll(); toast(conflicts ? `Synced ${done}. ${conflicts} sale needs the owner’s review.` : `Synced ${done} offline change${done === 1 ? '' : 's'}.`, conflicts ? 'err' : 'ok'); render() }
}
function setOnline(v) { if (NET.online === v) return; NET.online = v; if (v) flushOutbox(); softRender() }
addEventListener('online', () => setOnline(true));
addEventListener('offline', () => setOnline(false));
setInterval(() => { if (REMOTE && NET.outbox.length) { NET.online = navigator.onLine; flushOutbox() } }, 30000);

async function fetchAll(table) {
  const out = []; for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from(table).select('*').range(from, from + 999);
    if (error) throw error; out.push(...data); if (data.length < 1000) break;
  } return out;
}
async function loadAll() {
  if (!REMOTE) return;
  const res = await Promise.all(COLL.map(c => fetchAll(c)));
  COLL.forEach((c, i) => { S[c] = {}; res[i].forEach(r => { if (c === 'settings') S.settings[r.key] = r.data; else S[c][r.key] = { ...r.data, id: r.key } }) });
  S.costs = {}; if (can('cost')) (await fetchAll('costs')).forEach(r => S.costs[r.key] = Number(r.cost));
  S.staff = {}; if (can('staffView')) (await fetchAll('staff_roles')).forEach(r => S.staff[r.email] = r);
  S.messages = {}; try { (await fetchAll('messages')).forEach(r => S.messages[r.key] = { ...r.data, id: r.key }) } catch (e) { }
  // keep local offline changes visible
  NET.outbox.forEach(o => applyChanges(o.ch));
  persistLocal();
}
function subscribeRealtime() {
  if (!REMOTE || !sb || UI.rt) return;
  UI.rt = sb.channel('tle-db').on('postgres_changes', { event: '*', schema: 'public' }, p => {
    const t = p.table, row = p.new && p.new.key ? p.new : null;
    if (row && t === 'messages') { S.messages = S.messages || {}; S.messages[row.key] = { ...row.data, id: row.key }; return softRender() }
    if (!row || !COLL.includes(t)) return;
    if (t === 'settings') S.settings[row.key] = row.data; else S[t][row.key] = { ...row.data, id: row.key };
    persistLocal(); softRender();
  }).subscribe();
}
const softRender = debounce(() => {
  const a = document.activeElement;
  if ($('#modal').classList.contains('show') || (a && /INPUT|TEXTAREA|SELECT/.test(a.tagName))) { UI.dirty = true; renderChrome(); return }
  render();
}, 400);

async function uploadImage(file, bucket, maxW = 1000) {
  const blob = await compress(file, maxW);
  if (REMOTE && NET.online) {
    const path = `${Date.now().toString(36)}-${rnd(6)}.jpg`;
    const { error } = await sb.storage.from(bucket).upload(path, blob, { contentType: 'image/jpeg' });
    if (error) throw new Error('Photo upload failed: ' + error.message);
    if (bucket === 'product-images') return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    return 'storage:' + bucket + '/' + path;
  }
  return await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob) });
}
function compress(file, maxW) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => { const s = Math.min(1, maxW / img.width), c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); c.toBlob(b => b ? res(b) : rej(new Error('Couldn’t read that image')), 'image/jpeg', .82) };
    img.onerror = () => rej(new Error('Couldn’t read that image')); img.src = url;
  });
}
async function photoUrl(p) {
  if (!String(p).startsWith('storage:')) return p;
  const [bucket, ...rest] = p.slice(8).split('/');
  const { data } = await sb.storage.from(bucket).createSignedUrl(rest.join('/'), 3600);
  return data ? data.signedUrl : '';
}

/* ================= email receipts ================= */
// Sends through the Supabase Edge Function "send-receipt". Quietly does nothing until email is set up.
async function emailReceipt(ref, tell) {
  if (!REMOTE || !NET.online) return;
  try {
    const { data, error } = await sb.functions.invoke('send-receipt', { body: ref });
    if (!error && data && data.sent && tell) toast('Receipt emailed to the customer', 'ok');
  } catch (e) { }
}
/* ================= store API (public) ================= */
const API = {
  async catalog() {
    if (REMOTE) {
      const [{ data, error }, st2] = await Promise.all([sb.rpc('public_catalog'), sb.from('settings').select('*').in('key', ['areas', 'store', 'banners', 'blog', 'categories'])]);
      if (error) throw error;
      (st2.data || []).forEach(r => S.settings[r.key] = r.data);
      S.products = {}; UI.avail = {};
      (data || []).forEach(p => { S.products[p.id] = p; UI.avail[p.id] = p.available });
      return;
    }
    UI.avail = {}; vals('products').forEach(p => UI.avail[p.id] = avail(p.id));
  },
  async contact(m) {
    if (REMOTE) { const { data, error } = await sb.rpc('contact_message', { p: m }); if (error) throw new Error(friendlyErr(error.message)); return data }
    if (String(m.name || '').trim().length < 2) throw new Error('Add your name.'); if (String(m.message || '').trim().length < 5) throw new Error('Write your message.');
    if (normPhone(m.phone).length < 9 && !/^\S+@\S+\.\S+$/.test(m.email || '')) throw new Error('Add a phone number or email so we can reply.');
    const id = uid('M'), all = ls.get('tle-messages', {}); all[id] = { ...m, id, status: 'new', t: Date.now() }; ls.set('tle-messages', all); S.messages = all; return id;
  },
  async placeOrder(p) {
    if (REMOTE) { const { data, error } = await sb.rpc('place_order', { p }); if (error) throw new Error(friendlyErr(error.message)); return data }
    if (!p.items.length) throw new Error('Your cart is empty.');
    if (normPhone(p.phone).length < 9 || !String(p.name || '').trim()) throw new Error('Add your name and phone number.');
    const ar = set_('areas').find(a => a.name === p.area); if (!ar) throw new Error('Choose a delivery area.');
    let sub = 0; const items = [];
    for (const it of p.items) { const pr = prod(it.pid); if (!pr || pr.active === false) throw new Error('A product in your cart is no longer available.'); const a = avail(it.pid); if (a < it.qty) throw new Error(`Only ${a} of ${pr.name} left in stock.`); sub += pr.price * it.qty; items.push({ pid: it.pid, qty: it.qty, price: pr.price }) }
    let c = vals('customers').find(c => normPhone(c.phone) === normPhone(p.phone));
    const ch = { orders: [], customers: [], audit: [] };
    if (!c) { c = { id: 'C' + rnd(8), name: p.name.trim(), phone: p.phone, email: p.email || '', location: [p.area, p.landmark].filter(Boolean).join(', '), guest: true }; ch.customers.push(c) }
    const no = uid('ORD');
    ch.orders.push({ id: no, no, custId: c.id, items, area: p.area, fee: ar.fee, landmark: p.landmark || '', status: p.payment === 'paystack' ? 'paid' : 'pod', payment: p.payment || 'pod', ref: p.ref || '', t: Date.now(), serials: [], rider: '', saleId: null, subtotal: sub, total: sub + ar.fee });
    ch.audit.push({ ...auditRec('Online order placed', no), by: 'Customer' });
    applyChanges(ch); return { no, total: sub + ar.fee };
  },
  async track(no, phone) {
    if (REMOTE) { const { data } = await sb.rpc('track_order', { order_no: no, phone }); return data }
    const o = vals('orders').find(o => o.id.toUpperCase() === String(no).trim().toUpperCase()); const c = o && cust(o.custId);
    return o && c && normPhone(c.phone) === normPhone(phone) ? o : null;
  },
  async verify(serial, contact) {
    if (REMOTE) { const { data, error } = await sb.rpc('verify_purchase', { serial, contact }); if (error) throw new Error(friendlyErr(error.message)); return data }
    const s = normSerial(serial), u = S.units[s];
    if (!u) return { ok: false, msg: 'No record of this serial. It was not sold by PriceRight Tech Ltd.' };
    const f = findSaleItem(s);
    if (u.status !== 'sold' || !f) return { ok: false, msg: 'This serial can’t be claimed online. Please contact the shop.' };
    const c = cust(f.sale.custId), n = normPhone(contact), e = String(contact || '').trim().toLowerCase();
    if (!c || !((n.length >= 9 && normPhone(c.phone) === n) || (e.includes('@') && (c.email || '').toLowerCase() === e))) return { ok: false, msg: 'The serial and the phone number or email don’t match the same purchase.' };
    const cv = coverage(f.item, f.sale);
    return { ok: true, serial: s, pid: u.pid, product: pname(u.pid), saleNo: f.sale.id, saleT: f.sale.t, wEnd: f.item.wEnd, covK: cv.k, cov: cv.label, custId: c.id, open: vals('returns').some(r => r.serial === s && !['resolved', 'rejected'].includes(r.status)) };
  },
  async fileReturn(p) {
    if (REMOTE) { const { data, error } = await sb.rpc('file_return', { p }); if (error) throw new Error(friendlyErr(error.message)); return data }
    const v = await API.verify(p.serial, p.contact); if (!v.ok) throw new Error(v.msg); if (v.open) throw new Error('A return is already open for this serial.');
    const rma = uid('RMA');
    applyChanges({ returns: [{ id: rma, rma, serial: v.serial, pid: v.pid, saleRef: v.saleNo, custId: v.custId, channel: 'online', status: 'submitted', receivedSerial: '', entry: 'customer', reason: p.reason || '', desc: p.desc || '', photos: p.photos || [], cov: v.cov, covK: v.covK, t: Date.now(), events: [{ t: Date.now(), s: 'Filed online. Serial and contact verified.', by: 'Customer' }] }], audit: [{ ...auditRec('Return filed online', `${rma}, ${v.serial}`), by: 'Customer' }] });
    return { rma };
  }
};

/* ================= UI plumbing ================= */
function toast(msg, type = '') { const d = document.createElement('div'); d.className = 't ' + type; d.innerHTML = (type === 'ok' ? ic('check', 16) : type === 'err' ? ic('alert', 16) : '') + `<span>${esc(msg)}</span>`; $('#toast').appendChild(d); setTimeout(() => d.remove(), type === 'err' ? 5200 : 3400) }
let modalClose = null;
function modal(title, body, foot, opts = {}) {
  const b = $('#mbody'); b.className = opts.wide ? 'wide' : '';
  b.innerHTML = `<div class="mh"><h2>${title}</h2><span class="sp"></span><button class="btn ghost sm" onclick="closeModal()" aria-label="Close">${ic('x', 16)}</button></div><div class="mb">${body}</div>${foot ? `<div class="mf">${foot}</div>` : ''}`;
  $('#modal').classList.add('show'); modalClose = opts.onClose || null;
  setTimeout(() => { const f = b.querySelector('[autofocus]'); if (f) f.focus() }, 30);
}
function closeModal() { $('#modal').classList.remove('show'); $('#mbody').innerHTML = ''; const f = modalClose; modalClose = null; if (f) f(); if (UI.dirty) { UI.dirty = false; render() } }
$('#modal').addEventListener('mousedown', e => { if (e.target.id === 'modal') closeModal() });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#modal').classList.contains('show')) closeModal() });
function busy(btn, on) { if (!btn) return; if (on) { btn.dataset.l = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="spin"></span>' } else { btn.disabled = false; if (btn.dataset.l) btn.innerHTML = btn.dataset.l } }
async function act(btn, fn) { busy(btn, true); try { await fn() } catch (e) { toast(friendlyErr(e.message || e), 'err') } finally { if (btn && btn.isConnected) busy(btn, false) } }
function beep(ok = true) { try { const a = new (window.AudioContext || window.webkitAudioContext)(), o = a.createOscillator(), g = a.createGain(); o.frequency.value = ok ? 1250 : 280; g.gain.value = .06; o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + (ok ? .08 : .22)) } catch (e) { } }
const val = id => { const e = document.getElementById(id); return e ? e.value : '' };

/* ================= scanner ================= */
let SC = null;
function openScanner({ title, onScan, keepOpen = false, help = '' }) {
  SC = { onScan, keepOpen, last: '', lastT: 0, cam: null };
  modal(esc(title), `${help ? `<p class="muted small" style="margin-bottom:14px">${help}</p>` : ''}
  <div id="reader" class="reader"></div>
  <div class="camrow"><button class="btn pri" id="camBtn" onclick="startCam()">${ic('camera', 16)}Scan with camera</button><label class="btn filebtn">${ic('image', 16)}Take a photo<input type="file" accept="image/*" capture="environment" onchange="scanPhoto(this)"></label></div><div id="readerFile" style="display:none"></div>
  <label class="f" for="manualSerial">Can’t scan it? Type the code</label>
  <div class="row"><input id="manualSerial" class="mono" autocomplete="off" autocapitalize="characters" spellcheck="false" onkeydown="if(event.key==='Enter')manualScan()"><button class="btn" onclick="manualScan()">Add</button></div>
  <p class="hint">A USB or Bluetooth barcode scanner also works: click in this box and scan. Typed codes are flagged in the audit log.</p>
  <div id="scanLog" class="log"></div>`, `<button class="btn dark" onclick="closeModal()">Done</button>`, { onClose: () => { stopCam(); SC = null; render() } });
  if (matchMedia('(pointer:coarse)').matches) setTimeout(startCam, 150); else setTimeout(() => { const i = $('#manualSerial'); if (i) i.focus() }, 60);
}
async function handleCode(raw, method) {
  if (!SC) return; const code = normSerial(raw); if (!code) return;
  const t = Date.now(); if (code === SC.last && t - SC.lastT < 1800) return; SC.last = code; SC.lastT = t;
  let res; try { res = await SC.onScan(code, method) } catch (e) { res = { ok: false, msg: friendlyErr(e.message) } }
  res = res || { ok: false, msg: 'Not accepted' }; beep(res.ok);
  const lg = $('#scanLog'); if (lg) lg.insertAdjacentHTML('afterbegin', `<div class="${res.ok ? 'ok' : 'no'}">${ic(res.ok ? 'check' : 'x', 16, 2)}${sn(code, res.ok ? 'ok' : 'bad')}<span style="color:var(--ink)">${esc(res.msg)}</span></div>`);
  if (res.ok && !SC.keepOpen) setTimeout(closeModal, 380);
}
function manualScan() { const i = $('#manualSerial'); if (!i) return; const v = i.value; i.value = ''; handleCode(v, 'manual'); i.focus() }
const SCAN_FORMATS = () => { const F = window.Html5QrcodeSupportedFormats; return F ? ['CODE_128', 'CODE_39', 'CODE_93', 'EAN_13', 'EAN_8', 'UPC_A', 'UPC_E', 'ITF', 'CODABAR', 'QR_CODE', 'DATA_MATRIX', 'PDF_417'].map(k => F[k]).filter(v => v !== undefined) : undefined };
function camError(e) {
  const n = (e && (e.name || e.message || e)) + '';
  if (/NotAllowed|Permission/i.test(n)) return 'Camera permission is blocked. Allow camera access for this site in your browser settings, then try again.';
  if (/NotFound|Requested device not found|no camera/i.test(n)) return 'No camera found on this device. Use “Take a photo” or type the code.';
  if (/NotReadable|in use|Could not start/i.test(n)) return 'The camera is being used by another app. Close it and try again.';
  if (!window.isSecureContext) return 'The camera only works on the secure (https) address.';
  return 'Couldn’t start the camera. Use “Take a photo” or type the code.';
}
async function startCam() {
  if (!SC || SC.cam) return;
  if (!window.Html5Qrcode) return toast('The scanner didn’t load. Check the connection, or type the code.', 'err');
  const box = $('#reader'); if (!box) return; box.classList.add('on');
  const btn = $('#camBtn'); if (btn) btn.disabled = true;
  const cfg = { fps: 12, aspectRatio: 1.6, qrbox: (w, h) => ({ width: Math.max(220, Math.floor(w * .88)), height: Math.max(110, Math.floor(Math.min(h, w) * .45)) }) };
  const make = () => new Html5Qrcode('reader', { verbose: false, formatsToSupport: SCAN_FORMATS(), experimentalFeatures: { useBarCodeDetectorIfSupported: true } });
  try {
    SC.cam = make();
    try { await SC.cam.start({ facingMode: { ideal: 'environment' } }, cfg, txt => handleCode(txt, 'scan'), () => { }) }
    catch (e1) {
      if (/NotAllowed|Permission/i.test((e1 && e1.name || e1) + '')) throw e1;
      const cams = await Html5Qrcode.getCameras();
      if (!cams || !cams.length) throw e1;
      const back = cams.find(c => /back|rear|environment/i.test(c.label)) || cams[cams.length - 1];
      try { await SC.cam.clear() } catch (e) { }
      SC.cam = make();
      await SC.cam.start(back.id, cfg, txt => handleCode(txt, 'scan'), () => { });
    }
  } catch (e) { if (SC) SC.cam = null; box.classList.remove('on'); box.innerHTML = ''; toast(camError(e), 'err') }
  finally { if (btn) btn.disabled = false }
}
async function scanPhoto(inp) {
  const f = inp.files && inp.files[0]; inp.value = ''; if (!f) return;
  if (!window.Html5Qrcode) return toast('The scanner didn’t load. Type the code instead.', 'err');
  await stopCam();
  const tmp = new Html5Qrcode('readerFile', { verbose: false, formatsToSupport: SCAN_FORMATS(), experimentalFeatures: { useBarCodeDetectorIfSupported: true } });
  try { const txt = await tmp.scanFile(f, false); handleCode(txt, 'scan') }
  catch (e) { beep(false); toast('No barcode found in that photo. Hold the phone steady, fill the frame with the barcode and try again.', 'err') }
  finally { try { tmp.clear() } catch (e) { } }
}
async function stopCam() { if (SC && SC.cam) { try { await SC.cam.stop(); SC.cam.clear() } catch (e) { } SC.cam = null } const b = $('#reader'); if (b) { b.classList.remove('on') } }
const scanBtn = (label, sub, onclick) => `<button class="scan" onclick="${onclick}"><span class="sq">${ic('scan', 22)}</span><span><b>${label}</b><span class="sub">${sub}</span></span></button>`;
const emptyBox = (icon, title, text, btn = '') => `<div class="empty">${ic(icon, 28, 1.5)}<b>${title}</b>${text}${btn ? `<div>${btn}</div>` : ''}</div>`;

/* ================= routing ================= */
const route = () => { const h = location.hash.replace(/^#\/?/, ''); const [path, qs] = h.split('?'); return { parts: path.split('/').filter(Boolean), q: new URLSearchParams(qs || '') } };
const go = h => { if (location.hash === '#/' + h) render(); else location.hash = '/' + h; window.scrollTo(0, 0) };
addEventListener('hashchange', () => { UI.menu = false; render(); window.scrollTo(0, 0) });

/* ================= install (PWA) ================= */
let installEvt = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; renderChrome() });
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const canInstall = () => !standalone() && (installEvt || isIOS);
async function installApp() {
  if (installEvt) { installEvt.prompt(); await installEvt.userChoice; installEvt = null; render(); return }
  modal('Install on this device', `<ol style="margin:0;padding-left:20px;line-height:1.8"><li>Tap the <b>Share</b> button in Safari.</li><li>Choose <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>. The app opens full screen from your home screen.</li></ol>`, `<button class="btn dark" onclick="closeModal()">Got it</button>`);
}
if ('serviceWorker' in navigator && location.protocol === 'https:') addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => { }));

/* ================= render root ================= */
function render() {
  if (IS_STAFF) { if (!ME) return renderLogin(); return renderStaff() }
  renderStore();
}
function renderChrome() { if (IS_STAFF && ME) { const n = $('#navWrap'); if (n) n.innerHTML = navHTML(); const p = $('#netPill'); if (p) p.outerHTML = netPill() } }

/* ================= staff: sign in ================= */
function renderLogin(err = '') {
  document.title = 'Sign in · PriceRight Staff';
  $('#app').innerHTML = `<div class="auth"><div class="brandside"><div class="lockup"><span class="mk"></span><span class="wm">PriceRight<span>Tech Ltd</span></span></div>
  <div class="copy"><h1>Every device, scanned in and scanned out.</h1><p>Stock, sales, online orders and returns for the shop, tied together by the serial number.</p><div class="tagrow">${sn('IN STOCK')}${sn('SOLD')}${sn('VERIFIED')}</div></div>
  <small>Staff only. Customers can shop at <a href="/" style="color:#fff">${esc(location.host || 'the store')}</a>.</small></div>
  <div class="formside"><form onsubmit="event.preventDefault();doLogin(this)" novalidate><h2>Sign in</h2><p class="lede">Use the email and password from your IT admin.</p>
  <label class="f" for="lgE">Email</label><input id="lgE" type="email" autocomplete="username" required autofocus value="${esc(ls.get('tle-last-email', ''))}">
  <label class="f" for="lgP">Password</label><div class="pw"><input id="lgP" type="password" autocomplete="current-password" required><button type="button" onclick="const i=$('#lgP');i.type=i.type==='password'?'text':'password';this.textContent=i.type==='password'?'Show':'Hide'">Show</button></div>
  ${err ? `<div class="formerr">${ic('alert', 16)}<span>${esc(err)}</span></div>` : ''}
  <button class="btn pri lg block" style="margin-top:20px" type="submit">Sign in</button>
  <div class="row between mt small"><button type="button" class="btn ghost sm" onclick="forgotPw()">Forgot password?</button>${REMOTE ? `<button type="button" class="btn ghost sm" onclick="firstTime()">First time? Set your password</button>` : ''}</div>
  </form></div></div>`;
  setTimeout(() => { const e = $('#lgE'); if (e && e.value) $('#lgP').focus() }, 30);
}
async function doLogin(f) {
  const email = val('lgE').trim().toLowerCase(), pw = val('lgP'), btn = f.querySelector('button[type=submit]');
  if (!email || !pw) return renderLogin('Enter your email and password.');
  busy(btn, true);
  try {
    if (REMOTE) {
      const { error } = await sb.auth.signInWithPassword({ email, password: pw });
      if (error) throw new Error(/Invalid login/i.test(error.message) ? 'Email or password is incorrect.' : /confirm/i.test(error.message) ? 'Confirm your email first, using the link Supabase sent you.' : error.message);
      await afterRemoteSignIn(email);
    } else {
      const acct = S.staff[email]; const h = await sha(email + ':' + pw);
      if (!acct || acct.hash !== h) throw new Error('Email or password is incorrect.');
      ME = { email, role: acct.role, name: acct.name }; ls.set('tle-session', email);
    }
    ls.set('tle-last-email', email);
    if (!location.hash || location.hash === '#/') location.hash = '/dashboard';
    render(); toast('Signed in as ' + meName(), 'ok');
  } catch (e) { ME = null; renderLogin(friendlyErr(e.message)) }
}
async function afterRemoteSignIn(email) {
  const { data: role, error } = await sb.rpc('my_role');
  if (error) throw error;
  if (!role) { await sb.auth.signOut(); throw new Error('This account doesn’t have staff access. Ask your IT admin to add it.') }
  ME = { email, role, name: '' };
  const cache = await idb.get('cache:' + email); if (cache) { COLL.forEach(c => S[c] = cache[c] || {}); S.costs = cache.costs || {}; S.staff = cache.staff || {} }
  await loadAll();
  const me2 = S.staff[email]; if (me2 && me2.name) ME.name = me2.name;
  subscribeRealtime(); flushOutbox();
}
function forgotPw() {
  if (!REMOTE) return modal('Reset your password', `<p>Ask your IT admin to set a new password for you in <b>Staff accounts</b>.</p>`, `<button class="btn dark" onclick="closeModal()">OK</button>`);
  modal('Reset your password', `<p class="muted" style="margin-bottom:12px">We’ll email you a link to choose a new password.</p><label class="f" for="fpE">Email</label><input id="fpE" type="email" value="${esc(val('lgE'))}" autofocus>`,
    `<button class="btn" onclick="closeModal()">Cancel</button><button class="btn pri" onclick="act(this,async()=>{const {error}=await sb.auth.resetPasswordForEmail(val('fpE').trim(),{redirectTo:location.origin+'/staff'});if(error)throw error;closeModal();toast('Check your email for the reset link.','ok')})">Send reset link</button>`);
}
function firstTime() {
  modal('Set your password', `<p class="muted" style="margin-bottom:12px">Your IT admin must add your email first. Then choose a password here.</p><label class="f" for="ftE">Work email</label><input id="ftE" type="email" value="${esc(val('lgE'))}" autofocus><label class="f" for="ftP">New password</label><input id="ftP" type="password" autocomplete="new-password"><p class="hint">At least 8 characters.</p>`,
    `<button class="btn" onclick="closeModal()">Cancel</button><button class="btn pri" onclick="act(this,async()=>{const e=val('ftE').trim().toLowerCase(),p=val('ftP');if(p.length<8)throw new Error('Use at least 8 characters.');const {data,error}=await sb.auth.signUp({email:e,password:p});if(error)throw error;closeModal();if(data.session){await afterRemoteSignIn(e);location.hash='/dashboard';render()}else toast('Check your email to confirm the account, then sign in.','ok')})">Create password</button>`);
}
async function signOut() {
  if (NET.outbox.length && !confirm(`${NET.outbox.length} change(s) made offline haven’t synced yet. They stay on this device and sync next time someone signs in here. Sign out anyway?`)) return;
  if (REMOTE) { try { await sb.auth.signOut() } catch (e) { } if (UI.rt) { sb.removeChannel(UI.rt); UI.rt = null } }
  ME = null; ls.del('tle-session'); resetPos(); resetRecv(); UI.fr = null; UI.count = null; location.hash = ''; render();
}

/* ================= staff shell ================= */
const NAV = [
  ['Counter', [['dashboard', 'Overview', 'home'], ['pos', 'New sale', 'receipt'], ['orders', 'Online orders', 'truck'], ['file-return', 'File a return', 'undo']]],
  ['Stock', [['products', 'Products', 'box'], ['receive', 'Receive stock', 'inbox'], ['inventory', 'Inventory', 'layers'], ['count', 'Stock count', 'count']]],
  ['Aftercare', [['returns', 'Returns desk', 'tool'], ['customers', 'Customers', 'users']]],
  ['Business', [['sales', 'Sales', 'cash'], ['reports', 'Reports', 'chart', 'reports'], ['audit', 'Audit log', 'doc', 'audit']]],
  ['Website', [['messages', 'Messages', 'mail', 'messages'], ['banners', 'Banners', 'image', 'catalog'], ['blog', 'Blog', 'edit', 'catalog'], ['catalogue', 'Categories and SKUs', 'tag', 'catalog']]],
  ['Admin', [['settings', 'Settings', 'gear', 'settings'], ['staff', 'Staff accounts', 'userplus', 'staffView']]]
];
const TITLES = { dashboard: 'Overview', pos: 'New sale', orders: 'Online orders', 'file-return': 'File a return', products: 'Products', receive: 'Receive stock', inventory: 'Inventory', count: 'Stock count', returns: 'Returns desk', customers: 'Customers', sales: 'Sales', reports: 'Reports', audit: 'Audit log', settings: 'Settings', staff: 'Staff accounts', messages: 'Messages', banners: 'Home page banners', blog: 'Blog', catalogue: 'Categories and SKUs' };
function badge(k) {
  let n = 0;
  if (k === 'orders') n = vals('orders').filter(o => ['paid', 'pod'].includes(o.status)).length;
  if (k === 'returns') n = vals('returns').filter(r => r.status === 'submitted' || (r.status === 'verified' && can('decide'))).length;
  if (k === 'sales') n = vals('sales').filter(s => s.status === 'conflict').length;
  if (k === 'messages') n = Object.values(S.messages || {}).filter(m => m.status === 'new').length;
  return n ? `<span class="cnt">${n}</span>` : '';
}
function navHTML() {
  const cur = route().parts[0] || 'dashboard';
  return NAV.map(([g, items]) => { const vis = items.filter(i => !i[3] || can(i[3])); return vis.length ? `<div class="grp">${g}</div>` + vis.map(([k, l, icn]) => `<a href="#/${k}" class="${cur === k ? 'act' : ''}">${ic(icn, 18)}<span>${l}</span>${badge(k)}</a>`).join('') : '' }).join('');
}
function netPill() {
  if (!REMOTE) return `<span id="netPill" class="pill warn" title="Not connected to a database yet">${ic('alert', 14)}Saved on this device</span>`;
  const q = NET.outbox.length;
  if (!NET.online) return `<button id="netPill" class="pill warn" onclick="syncPanel()">${ic('wifioff', 14)}Offline${q ? `, ${q} waiting` : ''}</button>`;
  if (q) return `<button id="netPill" class="pill warn" onclick="syncPanel()">${ic('sync', 14)}${q} waiting to sync</button>`;
  return `<span id="netPill" class="pill ok">${ic('wifi', 14)}Online</span>`;
}
function syncPanel() {
  modal('Changes waiting to sync', `${NET.outbox.length ? `<div class="list" style="margin:-18px">${NET.outbox.map(o => `<div><span class="sp"><b>${esc(o.saleId ? 'Sale ' + o.saleId : 'Change')}</b><div class="small muted">${fmtT(o.t)}</div></span></div>`).join('')}</div>` : '<p class="muted">Everything is synced.</p>'}`,
    `<button class="btn" onclick="closeModal()">Close</button><button class="btn pri" onclick="NET.online=navigator.onLine;closeModal();flushOutbox()" ${NET.outbox.length ? '' : 'disabled'}>${ic('sync', 15)}Sync now</button>`);
}
function renderStaff() {
  const r = route(), page = r.parts[0] || 'dashboard';
  const item = NAV.flatMap(g => g[1]).find(i => i[0] === page);
  if (!item || (item[3] && !can(item[3]))) { location.hash = '/dashboard'; return }
  document.title = TITLES[page] + ' · PriceRight Staff';
  const body = V[page](r);
  $('#app').innerHTML = `<div class="app ${UI.menu ? 'open' : ''}"><aside class="side" aria-label="Main menu"><div class="lockup"><span class="mk"></span><span class="wm">PriceRight<span>Staff</span></span></div>
  <nav id="navWrap">${navHTML()}</nav>
  <div class="foot">${canInstall() ? `<button class="sidebtn" onclick="installApp()">${ic('download', 18)}Install app</button>` : ''}<a class="sidebtn" href="/" target="_blank" rel="noopener">${ic('store', 18)}View online store</a><button class="sidebtn" onclick="signOut()">${ic('logout', 18)}Sign out</button>
  <div class="who"><span class="av">${esc(initials(meName()))}</span><span class="grow"><b>${esc(meName())}</b><span>${meName() === ROLE_NAME[ME.role] ? esc(ME.email) : ROLE_NAME[ME.role]}</span></span></div></div></aside>
  <div class="scrim" onclick="UI.menu=false;render()"></div>
  <div class="main">${!REMOTE ? '' : !NET.online ? `<div class="banner warn">${ic('wifioff', 16)}<span>You’re offline. Sales and stock intake are saved on this device and checked again when the connection returns. Card payments need internet.</span></div>` : ''}
  <header class="top"><button class="menu-btn" onclick="UI.menu=true;render()" aria-label="Open menu">${ic('menu', 22)}</button><h1>${TITLES[page]}</h1><span class="sp"></span>
  <div class="search" role="search">${ic('search', 16)}<input id="gq" placeholder="Serial, receipt, order or phone" onkeydown="if(event.key==='Enter')globalSearch(this.value)" aria-label="Search"><button onclick="openScanner({title:'Scan to look up',onScan:c=>{setTimeout(()=>globalSearch(c),420);return{ok:true,msg:'Looking up'}}})" aria-label="Scan to look up">${ic('scan', 16)}</button></div>
  ${netPill()}</header>
  <main class="page">${body}</main></div></div>`;
}
function globalSearch(q) {
  q = String(q || '').trim(); if (!q) return; const s = normSerial(q), up = q.toUpperCase();
  const u = S.units[s] || vals('units').find(x => x.imei === q);
  if (u) return lookup(u.serial);
  const sale = S.sales[up]; if (sale) return showReceipt(sale.id);
  const o = S.orders[up]; if (o) { go('orders'); return }
  const r = S.returns[up]; if (r) return viewReturn(r.id);
  const n = normPhone(q); const c = n.length >= 9 && vals('customers').find(c => normPhone(c.phone) === n);
  if (c) return viewCustomer(c.id);
  modal('No match', `<div class="refuse">${ic('alert', 16)}<span>Nothing matches “${esc(q)}”. Try a full serial, IMEI, receipt number, order number or phone number.</span></div>`, `<button class="btn dark" onclick="closeModal()">Close</button>`);
}
const V = {};

/* ================= overview ================= */
function barChart(points, h = 220) {
  const W = 760, pad = { l: 72, r: 12, t: 12, b: 30 }, max = Math.max(1, ...points.map(p => p.v));
  const step = Math.pow(10, Math.floor(Math.log10(max))); const top = Math.ceil(max / step) * step;
  const bw = (W - pad.l - pad.r) / points.length, ih = h - pad.t - pad.b;
  const every = Math.ceil(points.length / 10);
  let g = ''; for (let i = 0; i <= 4; i++) { const y = pad.t + ih - ih * i / 4; g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}" stroke="#EDF0F4"/><text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" font-size="13" fill="#8A92A3">${(top * i / 4).toLocaleString('en-GB', { maximumFractionDigits: 0 })}</text>` }
  const bars = points.map((p, i) => { const bh = ih * p.v / top, x = pad.l + i * bw + bw * .18; return `<rect x="${x}" y="${pad.t + ih - bh}" width="${bw * .64}" height="${Math.max(bh, p.v ? 2 : 0)}" rx="2" fill="${p.hi ? '#1F6BFF' : '#9DB8F5'}"><title>${esc(p.l)}: ${money(p.v)}</title></rect>${i % every === 0 ? `<text x="${x + bw * .32}" y="${h - 8}" text-anchor="middle" font-size="13" fill="#8A92A3">${esc(p.s)}</text>` : ''}` }).join('');
  return `<svg viewBox="0 0 ${W} ${h}" role="img" aria-label="Sales by day">${g}${bars}</svg>`;
}
function dailySeries(days, filter = () => true) {
  const out = []; const t0 = startOfDay(Date.now());
  for (let i = days - 1; i >= 0; i--) { const d = t0 - i * DAY; const v = vals('sales').filter(s => s.status !== 'voided' && s.t >= d && s.t < d + DAY && filter(s)).reduce((a, s) => a + netOf(s), 0); const dt = new Date(d); out.push({ v, l: fmtD(d), s: dt.getDate() + ' ' + dt.toLocaleDateString('en-GB', { month: 'short' }), hi: i === 0 }) }
  return out;
}
const netOf = s => (s.total || 0) - (s.refunds || []).reduce((b, r) => b + r.amount, 0);
V.dashboard = () => {
  const mineOnly = !can('allSales');
  const today = vals('sales').filter(s => s.status !== 'voided' && sameDay(s.t) && (!mineOnly || s.staff === meName()));
  const toPack = vals('orders').filter(o => ['paid', 'pod'].includes(o.status));
  const openRet = vals('returns').filter(r => !['resolved', 'rejected'].includes(r.status));
  const low = vals('products').filter(p => p.active !== false && avail(p.id) <= (p.low ?? 2));
  const conf = vals('sales').filter(s => s.status === 'conflict');
  const insp = vals('units').filter(u => u.status === 'returned_inspection');
  const todo = [];
  conf.forEach(s => todo.push(['Review', 'r', `Offline sale ${s.id} clashed with another sale`, `sales?st=conflict`]));
  toPack.forEach(o => todo.push(['Pack', 'a', `${o.id}: ${o.items.reduce((a, i) => a + i.qty, 0)} item(s) for ${(cust(o.custId) || {}).name || 'customer'}, ${o.area}`, 'orders']));
  vals('returns').filter(r => r.status === 'verified').forEach(r => todo.push([can('decide') ? 'Decide' : 'Waiting', 'b', `${r.id}: ${pname(r.pid)}, needs a decision`, 'returns']));
  vals('returns').filter(r => r.status === 'submitted').forEach(r => todo.push(['Waiting', 'm', `${r.id}: waiting for the customer’s device`, 'returns']));
  if (insp.length && can('inspect')) todo.push(['Inspect', 'a', `${insp.length} returned unit${insp.length > 1 ? 's' : ''} to inspect`, 'returns']);
  const recent = vals('sales').filter(s => !mineOnly || s.staff === meName()).sort((a, b) => b.t - a.t).slice(0, 6);
  const first = !vals('products').length;
  return `<div class="pagehead"><p class="lede">${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}. ${mineOnly ? 'Sales figures show your own sales.' : 'Figures cover the whole shop.'}</p></div>
  ${first && can('catalog') ? `<div class="card"><div class="bd row between"><div><h2>Set up the shop</h2><p class="muted" style="margin-top:4px">Add your products, then receive stock by scanning serials. Products appear in the online store once they have stock.</p></div><div class="row"><a class="btn" href="#/settings">Store details</a><a class="btn pri" href="#/products?new=1">${ic('plus', 16)}Add first product</a></div></div></div>` : ''}
  <div class="kpis"><div class="kpi"><div class="v">${money(today.reduce((a, s) => a + netOf(s), 0))}</div><div class="k">${mineOnly ? 'Your sales today' : 'Sales today'}, ${today.length} receipt${today.length === 1 ? '' : 's'}</div></div>
  <div class="kpi"><div class="v">${vals('units').filter(u => u.status === 'in_stock').length}</div><div class="k">Units in stock</div></div>
  <div class="kpi"><div class="v">${toPack.length}</div><div class="k">Online orders to pack</div></div>
  <div class="kpi"><div class="v">${openRet.length}</div><div class="k">Returns open</div></div></div>
  <div class="cols c-main"><div>
  ${can('reports') ? `<section class="card"><div class="hd"><h2>Sales, last 14 days</h2><span class="sp"></span><a class="btn ghost sm" href="#/reports">Reports${ic('chev', 14)}</a></div><div class="chart">${barChart(dailySeries(14))}</div></section>` : ''}
  <section class="card"><div class="hd"><h2>Recent sales</h2><span class="sp"></span><a class="btn ghost sm" href="#/sales">All sales${ic('chev', 14)}</a></div>${recent.length ? `<div class="list">${recent.map(s => `<div class="click" style="cursor:pointer" onclick="showReceipt('${s.id}')"><span class="sp"><span class="mono strong">${s.id}</span><div class="small muted">${fmtT(s.t)}, ${esc((cust(s.custId) || {}).name || '')}</div></span>${saleSt(s)}<span class="strong nowrap">${money(s.total)}</span></div>`).join('')}</div>` : emptyBox('receipt', 'No sales yet', 'Sales you complete will show here.', `<a class="btn pri" href="#/pos">New sale</a>`)}</section></div>
  <div><section class="card"><div class="hd"><h2>Needs attention</h2></div>${todo.length ? `<div class="list">${todo.slice(0, 8).map(([b, c, t, h]) => `<div>${st(b, c)}<span class="sp small">${esc(t)}</span><a class="btn sm" href="#/${h}">Open</a></div>`).join('')}</div>` : emptyBox('check', 'All clear', 'Nothing needs you right now.')}</section>
  <section class="card"><div class="hd"><h2>Running low</h2></div>${low.length ? `<div class="list">${low.slice(0, 8).map(p => `<div><span class="sp">${esc(p.name)}</span><span class="st ${avail(p.id) ? 'a' : 'r'}">${avail(p.id)} left</span></div>`).join('')}</div>` : emptyBox('box', 'Stock levels are fine', 'Products at or below their reorder level show here.')}</section></div></div>`;
};

/* ================= POS ================= */
async function posScan(code, method) {
  const u = S.units[code];
  if (!u) return { ok: false, msg: 'Unknown serial. It was never received into stock.' };
  if (UI.pos.cart.some(c => c.serial === code)) return { ok: false, msg: 'Already in this sale' };
  if (u.status !== 'in_stock') return { ok: false, msg: 'Refused: ' + UST[u.status][0] + (u.saleId ? ` on ${u.saleId}` : '') };
  const p = prod(u.pid); if (!p) return { ok: false, msg: 'This unit’s product was deleted' };
  if (held(u.pid) > 0 && avail(u.pid) <= UI.pos.cart.filter(c => c.pid === u.pid).length) return { ok: false, msg: 'The remaining units are held for online orders' };
  UI.pos.cart.push({ serial: code, pid: u.pid, method });
  return { ok: true, msg: `${p.name}, ${money(p.price)}` };
}
function posTotals() { const sub = UI.pos.cart.reduce((a, c) => a + (prod(c.pid) || {}).price || 0, 0); const d = Math.min(Number(UI.pos.discount) || 0, sub); return { sub, d, total: sub - d } }
const totHTML = T => `<div class="tot"><span>Subtotal</span><span>${money(T.sub)}</span></div><div class="tot"><span>Discount</span><span>${T.d ? '−' + money(T.d) : money(0)}</span></div><div class="tot big"><span>Total</span><span>${money(T.total)}</span></div>`;
function updPos() { const e = $('#posTot'); if (e) e.innerHTML = totHTML(posTotals()); const c = $('#change'); if (c) { const T = posTotals(), t = Number(UI.pos.tendered) || 0; c.textContent = t ? (t >= T.total ? 'Change: ' + money(t - T.total) : 'Short by ' + money(T.total - t)) : '' } }
V.pos = () => {
  const P = UI.pos, g = {}; P.cart.forEach(c => (g[c.pid] = g[c.pid] || []).push(c)); const T = posTotals();
  const M = { cash: 'Cash', momo: 'MoMo', card: 'Card', split: 'Split' };
  return `<div class="cols c-main"><div>
  ${scanBtn('Scan items', 'Each item is checked by its serial. Quantity is the number of serials scanned.', "openScanner({title:'Scan items',keepOpen:true,onScan:posScan,help:'Keep scanning. Sold or unknown serials are refused.'})")}
  <section class="card" style="margin-top:16px"><div class="hd"><h2>Items</h2><span class="sp"></span><span class="small muted">${P.cart.length} serial${P.cart.length === 1 ? '' : 's'} verified</span>${P.cart.length ? `<button class="btn ghost sm" onclick="resetPos();render()">Clear</button>` : ''}</div><div class="bd" style="padding-top:4px;padding-bottom:4px">
  ${P.cart.length ? Object.entries(g).map(([pid, list]) => { const p = prod(pid) || {}; return `<div class="line"><div class="thumb">${pic(p, 40, 28)}</div><div class="grow"><div class="row between"><span class="strong">${esc(p.name)}</span><span class="strong">${money(p.price * list.length)}</span></div><div class="small muted">${list.length} × ${money(p.price)}</div><div class="sns">${list.map(c => `<span>${sn(c.serial, c.method === 'manual' ? 'typed' : 'ok')}<button class="x" onclick="UI.pos.cart=UI.pos.cart.filter(x=>x.serial!=='${c.serial}');render()" aria-label="Remove ${c.serial}">${ic('x', 13)}</button></span>`).join('')}</div></div></div>` }).join('') : emptyBox('scan', 'No items yet', 'Scan the first item to start the sale.')}
  </div></section></div>
  <section class="card"><div class="hd"><h2>Customer and payment</h2></div><div class="bd">
  <label class="f" for="pcPhone" style="margin-top:0">Phone number</label><input id="pcPhone" value="${esc(P.cust.phone)}" oninput="posPhone(this.value)" inputmode="tel" autocomplete="off">
  <div id="custHit" class="small" style="margin-top:6px"></div>
  <label class="f" for="pcName">Full name</label><input id="pcName" value="${esc(P.cust.name)}" oninput="UI.pos.cust.name=this.value" autocomplete="off">
  <div class="fgrid"><div><label class="f" for="pcEmail">Email (optional)</label><input id="pcEmail" type="email" value="${esc(P.cust.email)}" oninput="UI.pos.cust.email=this.value"></div><div><label class="f" for="pcLoc">Location</label><input id="pcLoc" value="${esc(P.cust.location)}" oninput="UI.pos.cust.location=this.value"></div>
  <div><label class="f" for="pDisc">Discount (GH₵)</label><input id="pDisc" type="number" min="0" inputmode="decimal" value="${esc(P.discount)}" oninput="UI.pos.discount=this.value;updPos()"></div><div><label class="f" for="pReason">Reason for discount</label><input id="pReason" value="${esc(P.reason)}" oninput="UI.pos.reason=this.value"></div></div>
  <label class="f">Payment</label><div class="seg">${Object.entries(M).map(([k, v]) => `<button class="${P.method === k ? 'on' : ''}" onclick="UI.pos.method='${k}';render()">${v}</button>`).join('')}</div>
  ${P.method === 'cash' ? `<label class="f" for="pTend">Cash received (optional)</label><input id="pTend" type="number" inputmode="decimal" value="${esc(P.tendered)}" oninput="UI.pos.tendered=this.value;updPos()"><div id="change" class="hint strong" style="color:var(--ink)"></div>` : ''}
  ${P.method === 'momo' || P.method === 'split' ? `<label class="f" for="pRef">MoMo transaction ID</label><input id="pRef" class="mono" value="${esc(P.ref)}" oninput="UI.pos.ref=this.value">` : ''}
  ${P.method === 'card' ? `<label class="f" for="pRef">Card approval code (optional)</label><input id="pRef" class="mono" value="${esc(P.ref)}" oninput="UI.pos.ref=this.value">${REMOTE && !NET.online ? '<p class="hint" style="color:var(--red)">Card payments need internet.</p>' : ''}` : ''}
  ${P.method === 'split' ? `<label class="f" for="pSplit">Cash part (the rest on MoMo)</label><input id="pSplit" type="number" inputmode="decimal" value="${esc(P.split)}" oninput="UI.pos.split=this.value">` : ''}
  <div id="posTot" style="margin-top:16px">${totHTML(T)}</div>
  <button class="btn pri lg block" style="margin-top:14px" onclick="act(this,completeSale)" ${P.cart.length ? '' : 'disabled'}>${REMOTE && !NET.online ? 'Complete sale offline' : 'Complete sale'}</button>
  </div></section></div>`;
};
function posPhone(v) {
  UI.pos.cust.phone = v; const n = normPhone(v); const c = n.length >= 9 && vals('customers').find(c => normPhone(c.phone) === n); const h = $('#custHit');
  if (c) { UI.pos.cust = { phone: v, name: c.name, email: c.email || '', location: c.location || '', id: c.id }; $('#pcName').value = c.name; $('#pcEmail').value = c.email || ''; $('#pcLoc').value = c.location || ''; h.innerHTML = `<span style="color:var(--green);display:inline-flex;gap:6px;align-items:center">${ic('check', 14, 2)}Returning customer. Details filled in.</span>` }
  else { delete UI.pos.cust.id; if (h) h.innerHTML = '' }
}
function customerFor(c) {
  const n = normPhone(c.phone); const x = vals('customers').find(k => normPhone(k.phone) === n);
  if (x) return { ...x, name: c.name || x.name, email: c.email || x.email || '', location: c.location || x.location || '' };
  return { id: 'C' + rnd(8), name: c.name.trim(), phone: c.phone.trim(), email: (c.email || '').trim(), location: (c.location || '').trim(), guest: !!c.guest };
}
async function completeSale() {
  const P = UI.pos, T = posTotals();
  if (!P.cart.length) throw new Error('Scan at least one item.');
  if (!P.cust.name.trim() || normPhone(P.cust.phone).length < 9) throw new Error('Add the customer’s name and phone number.');
  if (T.d > 0 && !P.reason.trim()) throw new Error('Add a reason for the discount.');
  if (P.method === 'card' && REMOTE && !NET.online) throw new Error('Card payments need internet. Take cash or MoMo.');
  if ((P.method === 'momo' || P.method === 'split') && !P.ref.trim()) throw new Error('Add the MoMo transaction ID.');
  if (P.method === 'split' && !(Number(P.split) > 0 && Number(P.split) < T.total)) throw new Error('Enter the cash part of the split payment.');
  const c = customerFor(P.cust), t = Date.now(), id = uid('R');
  const pay = P.method === 'split' ? [{ method: 'cash', amount: Number(P.split), ref: '' }, { method: 'momo', amount: T.total - Number(P.split), ref: P.ref.trim() }] : [{ method: P.method, amount: T.total, ref: P.ref.trim() }];
  const items = P.cart.map(x => { const p = prod(x.pid); return { pid: x.pid, serial: x.serial, price: p.price, wEnd: addMonths(t, p.w ?? 12), method: x.method } });
  const sale = { id, no: id, channel: 'pos', custId: c.id, staff: meName(), staffEmail: ME.email, items, subtotal: T.sub, discount: T.d, discReason: P.reason.trim(), fee: 0, total: T.total, pay, status: 'completed', t, refunds: [] };
  const units = items.map(i => { const u = S.units[i.serial]; return { ...u, status: 'sold', saleId: id, hist: [...(u.hist || []), { t, type: `Sold on ${id}`, by: meName() }] } });
  const audit = [auditRec('Sale completed', `${id}, ${items.length} serial(s), ${money(T.total)}`)];
  if (T.d) audit.push(auditRec('Discount given', `${money(T.d)} on ${id}. Reason: ${P.reason.trim()}`));
  items.filter(i => i.method === 'manual').forEach(i => audit.push(auditRec('Serial typed at sale', i.serial)));
  const r = await tx({ sales: [sale], units, customers: [c], audit }, items.map(i => ({ serial: i.serial, expect: ['in_stock'] })), { offline: true, saleId: id });
  resetPos(); render(); showReceipt(id);
  if (r.queued) toast('Saved offline. It syncs when the connection returns.'); else if (c.email) emailReceipt({ sale: id }, true);
}
function receiptHTML(s) {
  const c = cust(s.custId) || {}, store = set_('store');
  return `<div class="receipt"><div class="c"><img class="logo" src="/logo-receipt.png" alt="PriceRight Tech Ltd"><b style="font-size:13px">${esc(store.name.toUpperCase())}</b><br>${esc(store.branch)}${store.address ? '<br>' + esc(store.address) : ''}${store.phone ? '<br>Tel ' + esc(store.phone) : ''}</div><hr>
  <div class="r"><span>Receipt</span><b>${esc(s.id)}</b></div><div class="r"><span>Date</span><span>${fmtT(s.t)}</span></div><div class="r"><span>Served by</span><span>${esc(s.staff)}</span></div>${s.orderNo ? `<div class="r"><span>Order</span><span>${esc(s.orderNo)}</span></div>` : ''}<hr>
  ${esc(c.name)}<br>${esc(c.phone)}${c.email ? '<br>' + esc(c.email) : ''}<hr>
  ${s.items.map(i => `<div>${esc(pname(i.pid))}</div><div class="r"><span>S/N ${esc(i.serial)}</span><span>${money(i.price)}</span></div><div>Warranty to ${fmtD(i.wEnd)}${i.replacementFor ? `, replaces ${esc(i.replacementFor)}` : ''}${i.returned ? ', RETURNED' : ''}</div>`).join('<div style="height:6px"></div>')}<hr>
  <div class="r"><span>Subtotal</span><span>${money(s.subtotal)}</span></div>${s.discount ? `<div class="r"><span>Discount</span><span>-${money(s.discount)}</span></div>` : ''}${s.fee ? `<div class="r"><span>Delivery</span><span>${money(s.fee)}</span></div>` : ''}
  <div class="r"><b>TOTAL</b><b>${money(s.total)}</b></div>${s.pay.filter(p => p.method !== 'refund').map(p => `<div class="r"><span>${esc(String(p.method).toUpperCase())}${p.ref ? ' ' + esc(p.ref) : ''}</span><span>${money(p.amount)}</span></div>`).join('')}
  ${s.payStatus === 'due' ? '<div class="r"><b>PAYMENT DUE ON DELIVERY</b></div>' : ''}${(s.refunds || []).map(r => `<div class="r"><span>REFUND ${esc(r.serial)}</span><span>-${money(r.amount)}</span></div>`).join('')}${s.status === 'voided' ? '<hr><div class="c"><b>VOIDED</b></div>' : ''}<hr>
  <div class="c">${esc(store.receiptFooter)}<br>${esc(location.host)}</div></div>`;
}
function receiptText(s) { const st2 = set_('store'); return `${st2.name}\nReceipt ${s.id}, ${fmtT(s.t)}\n\n${s.items.map(i => `${pname(i.pid)}\nS/N ${i.serial}\n${money(i.price)}, warranty to ${fmtD(i.wEnd)}`).join('\n\n')}\n\nTotal ${money(s.total)}\n\n${st2.receiptFooter}` }
function showReceipt(id) {
  const s = S.sales[id]; if (!s) return; const c = cust(s.custId) || {}, text = encodeURIComponent(receiptText(s)), wa = '233' + normPhone(c.phone).slice(1);
  const conflict = s.status === 'conflict';
  modal(`Receipt ${esc(s.id)}`, `${isPending(s.id) ? `<div class="note" style="margin-bottom:14px">${ic('sync', 16)}<span>Saved offline. It syncs when the connection returns.</span></div>` : ''}
  ${conflict ? `<div class="refuse" style="margin-bottom:14px">${ic('alert', 16)}<span>${esc(s.conflict || 'This offline sale clashed with another sale.')} Scan the device the customer took to fix the serial, or void the sale.</span></div>` : ''}${receiptHTML(s)}`,
    `${conflict && can('conflict') ? `<button class="btn" onclick="fixConflict('${s.id}')">${ic('scan', 16)}Fix serial</button><button class="btn danger" onclick="voidSale('${s.id}')">Void sale</button>` : ''}
  ${!conflict && s.status === 'completed' && can('void') ? `<button class="btn danger" onclick="voidSale('${s.id}')">Void</button>` : ''}
  <button class="btn" onclick="printReceipt('${s.id}')">${ic('printer', 16)}Print</button>${c.phone ? `<a class="btn" target="_blank" rel="noopener" href="https://wa.me/${wa}?text=${text}">${ic('msg', 16)}WhatsApp</a>` : ''}${c.email ? `<a class="btn" href="mailto:${esc(c.email)}?subject=${encodeURIComponent('Your receipt ' + s.id)}&body=${text}">${ic('mail', 16)}Email</a>` : ''}<button class="btn dark" onclick="closeModal()">Done</button>`);
}
function printReceipt(id) { $('#printArea').innerHTML = receiptHTML(S.sales[id]); window.print() }
async function voidSale(id) {
  const s = S.sales[id]; const reason = prompt(`Void ${id}? Its units go back into stock. Reason:`); if (reason === null) return;
  if (!reason.trim()) return toast('Add a reason to void the sale.', 'err');
  const units = s.status === 'conflict' ? [] : s.items.filter(i => !i.returned && (S.units[i.serial] || {}).status === 'sold' && S.units[i.serial].saleId === id).map(i => { const u = S.units[i.serial]; return { ...u, status: 'in_stock', saleId: null, hist: [...u.hist, { t: Date.now(), type: `Back in stock, ${id} voided`, by: meName() }] } });
  try { await tx({ sales: [{ ...s, status: 'voided', voidReason: reason.trim() }], units, audit: [auditRec('Sale voided', `${id}. Reason: ${reason.trim()}`)] }, units.map(u => ({ serial: u.serial, expect: ['sold'] }))); closeModal(); toast(id + ' voided', 'ok'); render() } catch (e) { toast(friendlyErr(e.message), 'err') }
}
function fixConflict(id) {
  const s = S.sales[id]; closeModal();
  setTimeout(() => openScanner({
    title: 'Scan the device the customer took', help: `The sale listed ${s.items.map(i => i.serial).join(', ')}. Scan the actual unit(s) in stock that went to the customer.`, keepOpen: true, onScan: async code => {
      const sale = S.sales[id]; const bad = sale.items.find(i => (S.units[i.serial] || {}).saleId !== id && !i.fixed);
      if (!bad) return { ok: false, msg: 'All serials on this sale are already fixed' };
      const u = S.units[code]; if (!u || u.status !== 'in_stock') return { ok: false, msg: 'Must be an in-stock unit' }; if (u.pid !== bad.pid) return { ok: false, msg: 'Must be the same product: ' + pname(bad.pid) };
      const items = sale.items.map(i => i === bad ? { ...i, serial: code, fixed: true, was: i.serial } : i);
      const left = items.some(i => (S.units[i.serial] || {}).saleId !== id && i.serial !== code && !i.fixed);
      await tx({ sales: [{ ...sale, items, status: left ? 'conflict' : 'completed' }], units: [{ ...u, status: 'sold', saleId: id, hist: [...u.hist, { t: Date.now(), type: `Sold on ${id} (corrected after sync)`, by: meName() }] }], audit: [auditRec('Offline sale corrected', `${id}: ${bad.serial} replaced by ${code}`)] }, [{ serial: code, expect: ['in_stock'] }]);
      return { ok: true, msg: left ? 'Fixed. Scan the next one.' : 'Sale corrected and completed' };
    }
  }), 250);
}

/* ================= sales ================= */
V.sales = r => {
  if (r.q.get('st')) { UI.salesF.st = r.q.get('st'); UI.salesF.range = 'all'; history.replaceState(null, '', '#/sales') }
  const F = UI.salesF, now = Date.now(), from = { today: startOfDay(now), '7': now - 7 * DAY, '30': now - 30 * DAY, all: 0 }[F.range];
  const q = F.q.trim().toLowerCase();
  let list = vals('sales').filter(s => s.t >= from && (can('allSales') || s.staffEmail === ME.email || s.staff === meName()));
  if (F.st !== 'all') list = list.filter(s => F.st === 'pending' ? isPending(s.id) : s.status === F.st);
  if (q) list = list.filter(s => s.id.toLowerCase().includes(q) || s.items.some(i => i.serial.toLowerCase().includes(q)) || ((cust(s.custId) || {}).name || '').toLowerCase().includes(q) || normPhone((cust(s.custId) || {}).phone).includes(normPhone(q) || '~'));
  list.sort((a, b) => b.t - a.t);
  const tot = list.filter(s => s.status !== 'voided').reduce((a, s) => a + netOf(s), 0);
  return `<div class="pagehead"><div class="seg" style="width:min(420px,100%)">${[['today', 'Today'], ['7', '7 days'], ['30', '30 days'], ['all', 'All']].map(([k, l]) => `<button class="${F.range === k ? 'on' : ''}" onclick="UI.salesF.range='${k}';render()">${l}</button>`).join('')}</div><span class="sp"></span>${can('allSales') ? `<button class="btn" onclick="exportSales()">${ic('download', 16)}Export CSV</button>` : ''}<a class="btn pri" href="#/pos">${ic('plus', 16)}New sale</a></div>
  <section class="card"><div class="hd"><div class="row" style="flex:1"><input placeholder="Receipt, serial, customer or phone" value="${esc(F.q)}" onchange="UI.salesF.q=this.value;render()" style="max-width:340px"><select style="max-width:200px" onchange="UI.salesF.st=this.value;render()" aria-label="Status">${[['all', 'All statuses'], ['completed', 'Completed'], ['voided', 'Voided'], ['conflict', 'Needs review'], ['pending', 'Waiting to sync']].map(([k, l]) => `<option value="${k}" ${F.st === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div><span class="small muted nowrap">${list.length} sale${list.length === 1 ? '' : 's'}${can('allSales') ? ', ' + money(tot) : ''}</span></div>
  ${list.length ? `<div class="tw"><table><tr><th>Receipt</th><th>Date</th><th>Customer</th><th>Served by</th><th class="num">Items</th><th class="num">Total</th><th>Status</th></tr>${list.slice(0, 300).map(s => `<tr class="click" onclick="showReceipt('${s.id}')"><td class="mono strong">${s.id}</td><td class="small nowrap">${fmtT(s.t)}</td><td>${esc((cust(s.custId) || {}).name || '')}<div class="small muted">${s.channel === 'online' ? 'Online order' : 'In shop'}</div></td><td class="small">${esc(s.staff)}</td><td class="num">${s.items.length}</td><td class="num">${money(s.total)}</td><td>${saleSt(s)}</td></tr>`).join('')}</table></div>` : emptyBox('receipt', 'No sales match', 'Try a different date range or search.')}</section>`;
};
function csv(rows) { return rows.map(r => r.map(v => { v = String(v ?? ''); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v }).join(',')).join('\n') }
function download(name, text, type = 'text/csv') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000) }
function exportSales() {
  const rows = [['Receipt', 'Date', 'Channel', 'Customer', 'Phone', 'Served by', 'Product', 'Serial', 'Price', 'Discount (sale)', 'Sale total', 'Payment', 'Status']];
  vals('sales').sort((a, b) => a.t - b.t).forEach(s => { const c = cust(s.custId) || {}; s.items.forEach(i => rows.push([s.id, new Date(s.t).toISOString(), s.channel, c.name, c.phone, s.staff, pname(i.pid), i.serial, i.price, s.discount, s.total, s.pay.map(p => p.method).join('+'), s.status])) });
  download(`top-league-sales-${ymd()}.csv`, csv(rows));
}

/* ================= products ================= */
const catList = () => [...new Set([...(set_('categories') || []), ...vals('products').map(p => p.cat)].filter(Boolean))];
// Next SKU for a type: PREFIX-0001, one after the highest already used.
function nextSku(prefix) {
  prefix = String(prefix || '').toUpperCase(); if (!prefix) return '';
  const re = new RegExp('^' + prefix.replace(/[^A-Z0-9]/g, '') + '-(\\d+)$'), max = vals('products').reduce((m, p) => { const x = re.exec(p.sku || ''); return x ? Math.max(m, Number(x[1])) : m }, 0);
  return `${prefix}-${String(max + 1).padStart(4, '0')}`;
}
V.products = r => {
  if (r.q.get('new') && can('catalog')) { history.replaceState(null, '', '#/products'); setTimeout(() => editProduct(), 30) }
  const F = UI.prodF, q = F.q.trim().toLowerCase(), cats = ['All', ...catList()];
  const list = vals('products').filter(p => (F.cat === 'All' || p.cat === F.cat) && (!q || [p.name, p.brand, p.sku].join(' ').toLowerCase().includes(q))).sort((a, b) => a.name.localeCompare(b.name));
  return `<div class="pagehead"><p class="lede">Your catalogue. A product shows in the online store when it’s active and has stock.</p><span class="sp"></span>${can('catalog') ? `<button class="btn pri" onclick="editProduct()">${ic('plus', 16)}Add product</button>` : ''}</div>
  <section class="card"><div class="hd"><div class="row" style="flex:1"><input placeholder="Search name, brand or SKU" value="${esc(F.q)}" onchange="UI.prodF.q=this.value;render()" style="max-width:320px"><select style="max-width:200px" onchange="UI.prodF.cat=this.value;render()" aria-label="Category">${cats.map(c => `<option ${F.cat === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div><span class="small muted">${list.length} product${list.length === 1 ? '' : 's'}</span></div>
  ${list.length ? `<div class="tw"><table><tr><th>Product</th><th>Category</th><th class="num">Price</th>${can('cost') ? '<th class="num">Cost</th>' : ''}<th class="num">In stock</th><th class="num">Available</th><th>Store</th></tr>${list.map(p => `<tr class="click" onclick="${can('catalog') ? `editProduct('${p.id}')` : `viewProductStock('${p.id}')`}"><td><div class="pcell"><div class="thumb">${pic(p, 40, 28)}</div><div><span class="strong">${esc(p.name)}</span><div class="small muted">${esc([p.brand, p.sku].filter(Boolean).join(' · ') || 'No brand')}</div></div></div></td><td>${esc(p.cat)}</td><td class="num">${money(p.price)}</td>${can('cost') ? `<td class="num">${S.costs['p:' + p.id] != null ? money(S.costs['p:' + p.id]) : '<span class="muted">Not set</span>'}</td>` : ''}<td class="num">${inStock(p.id)}</td><td class="num strong">${avail(p.id)}</td><td>${p.active === false ? st('Hidden', 'm') : st('Listed', 'g')}</td></tr>`).join('')}</table></div>` : emptyBox('box', vals('products').length ? 'No products match' : 'No products yet', vals('products').length ? 'Try another search or category.' : 'Add products so you can receive stock and sell.', can('catalog') && !vals('products').length ? `<button class="btn pri" onclick="editProduct()">${ic('plus', 16)}Add product</button>` : '')}</section>`;
};
function viewProductStock(id) { UI.invF = { q: prod(id).name, st: 'all' }; go('inventory') }
function editProduct(id) {
  const cl = catList(), types = set_('sku_types') || [];
  const p = id ? prod(id) : { id: '', name: '', brand: '', cat: cl[0] || '', sku: '', skuType: '', price: '', w: 12, r: 7, low: 2, phone: false, active: true, desc: '', img: '', featured: false, was: '' };
  UI.editImg = p.img || '';
  modal(id ? 'Edit product' : 'Add product', `<div class="fgrid">
  <div class="full"><label class="f" for="epN" style="margin-top:0">Product name</label><input id="epN" value="${esc(p.name)}" placeholder="e.g. HP EliteBook 840 G8, Core i7, 16GB, 512GB" autofocus></div>
  <div><label class="f" for="epB">Brand</label><input id="epB" value="${esc(p.brand)}"></div>
  <div><label class="f" for="epC">Category</label><select id="epC">${cl.map(c => `<option ${c === p.cat ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select><p class="hint">Manage the list in <a href="#/catalogue" onclick="closeModal()">Categories and SKUs</a>.</p></div>
  <div><label class="f" for="epT">SKU type</label><select id="epT" onchange="const t=this.selectedOptions[0];$('#epS').value=t.dataset.p?nextSku(t.dataset.p):''">${id && p.sku && !p.skuType ? `<option value="" data-p="">Keep current SKU</option>` : ''}${types.map(t => `<option value="${esc(t.prefix)}" data-p="${esc(t.prefix)}" ${t.prefix === p.skuType ? 'selected' : ''}>${esc(t.name)} (${esc(t.prefix)})</option>`).join('')}</select></div>
  <div><label class="f" for="epS">SKU</label><input id="epS" class="mono" value="${esc(p.sku || (types[0] ? nextSku(types[0].prefix) : ''))}" readonly style="background:var(--paper)"><p class="hint">Made automatically from the SKU type.</p></div>
  <div><label class="f" for="epP">Selling price (GH₵)</label><input id="epP" type="number" min="0" step="0.01" inputmode="decimal" value="${esc(p.price)}"></div>
  <div><label class="f" for="epO">Old price (optional)</label><input id="epO" type="number" min="0" step="0.01" inputmode="decimal" value="${esc(p.was || '')}"><p class="hint">Shown crossed out in the store when higher than the selling price.</p></div>
  ${can('cost') ? `<div><label class="f" for="epK">Cost price (GH₵)</label><input id="epK" type="number" min="0" step="0.01" inputmode="decimal" value="${esc(id ? S.costs['p:' + id] ?? '' : '')}"><p class="hint">Hidden from shop assistants.</p></div>` : ''}
  <div><label class="f" for="epL">Reorder level</label><input id="epL" type="number" min="0" value="${esc(p.low ?? 2)}"><p class="hint">Flag as running low at this many.</p></div>
  <div><label class="f" for="epW">Warranty (months)</label><input id="epW" type="number" min="0" value="${esc(p.w)}"></div>
  <div><label class="f" for="epR">Return window (days)</label><input id="epR" type="number" min="0" value="${esc(p.r)}"></div>
  <div class="full"><label class="f" for="epD">Description and specs</label><textarea id="epD" rows="5" placeholder="One spec per line, e.g.&#10;Intel Core i7, 11th gen&#10;16GB RAM, 512GB SSD">${esc(p.desc)}</textarea></div>
  <div class="full"><label class="f">Photo</label><div class="row"><div class="thumb" id="epImgPrev" style="width:96px;height:72px">${UI.editImg ? `<img src="${esc(UI.editImg)}" alt="">` : art(p, 64, 44)}</div><input type="file" accept="image/*" onchange="pickProductImg(this)" style="flex:1"></div></div>
  <div class="full"><label class="chk"><input id="epPh" type="checkbox" ${p.phone ? 'checked' : ''}><span>This is a phone. Require the IMEI for every unit.</span></label>
  <label class="chk"><input id="epA" type="checkbox" ${p.active !== false ? 'checked' : ''}><span>Show in the online store</span></label>
  <label class="chk"><input id="epF" type="checkbox" ${p.featured ? 'checked' : ''}><span>Feature on the store’s home page</span></label></div></div>`,
    `<button class="btn" onclick="closeModal()">Cancel</button><button class="btn pri" onclick="act(this,()=>saveProduct('${id || ''}'))">${id ? 'Save changes' : 'Add product'}</button>`, { wide: true });
}
async function pickProductImg(inp) {
  const f = inp.files[0]; if (!f) return; const prev = $('#epImgPrev'); prev.innerHTML = '<span class="spin"></span>';
  try { UI.editImg = await uploadImage(f, 'product-images', 1000); prev.innerHTML = `<img src="${esc(UI.editImg)}" alt="">` } catch (e) { prev.innerHTML = ''; toast(friendlyErr(e.message), 'err') }
}
async function saveProduct(id) {
  const name = val('epN').trim(), price = Number(val('epP'));
  if (!name) throw new Error('Add a product name.'); if (!(price > 0)) throw new Error('Add a selling price.');
  const old = id ? prod(id) : {}; const pid = id || 'P' + rnd(8);
  const ty = val('epT'), sku = id && old.skuType === ty && old.sku ? old.sku : (ty ? nextSku(ty) : val('epS').trim()), was = Number(val('epO')) || 0;
  if (sku && vals('products').some(x => x.id !== pid && x.sku === sku)) throw new Error(`SKU ${sku} is already used. Pick the SKU type again to get a new one.`);
  const p = { ...old, id: pid, name, brand: val('epB').trim(), cat: val('epC').trim() || 'Other', sku, skuType: ty || old.skuType || '', was: was > price ? was : 0, featured: $('#epF').checked, price, low: Number(val('epL')) || 0, w: Number(val('epW')) || 0, r: Number(val('epR')) || 0, desc: val('epD').trim(), img: UI.editImg || '', phone: $('#epPh').checked, active: $('#epA').checked, updated: Date.now() };
  const ch = { products: [p], audit: [auditRec(id ? 'Product updated' : 'Product added', name)] };
  if (can('cost') && val('epK') !== '') ch.costs = [{ key: 'p:' + pid, cost: Number(val('epK')) }];
  await tx(ch); closeModal(); toast(id ? 'Product saved' : 'Product added', 'ok'); render();
}

/* ================= receive stock ================= */
async function recvScan(code, method) {
  const R = UI.recv, p = prod(R.pid); if (!p) return { ok: false, msg: 'Choose a product first' };
  if (p.phone && /^\d{15}$/.test(code)) {
    const last = [...R.items].reverse().find(i => !i.imei); if (!last) return { ok: false, msg: 'Scan the phone’s serial first, then its IMEI' };
    if (vals('units').some(u => u.imei === code) || R.items.some(i => i.imei === code)) return { ok: false, msg: 'This IMEI is already registered' };
    last.imei = code; return { ok: true, msg: 'IMEI linked to ' + last.serial };
  }
  const ex = S.units[code]; if (ex) return { ok: false, msg: `Duplicate. Already in the system: ${UST[ex.status][0]}` };
  if (R.items.some(i => i.serial === code)) return { ok: false, msg: 'Already scanned in this batch' };
  R.items.push({ serial: code, imei: '', method });
  return { ok: true, msg: `${R.items.length}${R.expected ? ' of ' + R.expected : ''} scanned` + (p.phone ? '. Now scan its IMEI.' : '') };
}
V.receive = () => {
  const R = UI.recv, products = vals('products').sort((a, b) => a.name.localeCompare(b.name)); if (!R.pid && products[0]) R.pid = products[0].id;
  if (!products.length) return `<section class="card">${emptyBox('box', 'Add a product first', 'Stock is received against a product in your catalogue.', can('catalog') ? `<a class="btn pri" href="#/products?new=1">${ic('plus', 16)}Add product</a>` : 'Ask the shop owner to add the product.')}</section>`;
  const p = prod(R.pid) || {}, gap = R.expected && R.items.length < Number(R.expected), batches = vals('batches').sort((a, b) => b.t - a.t).slice(0, 15);
  return `<div class="pagehead"><p class="lede">Every item goes on the shelf with a serial. Items without a manufacturer serial get a printed PriceRight label.</p></div>
  <div class="cols c-main"><div><section class="card"><div class="hd"><h2>Delivery</h2></div><div class="bd">
  <label class="f" for="rProd" style="margin-top:0">Product</label><select id="rProd" onchange="UI.recv.pid=this.value;UI.recv.items=[];render()">${products.map(x => `<option value="${x.id}" ${x.id === R.pid ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>
  <div class="fgrid"><div><label class="f" for="rSup">Supplier</label><input id="rSup" value="${esc(R.supplier)}" oninput="UI.recv.supplier=this.value"></div><div><label class="f" for="rInv">Supplier invoice number</label><input id="rInv" value="${esc(R.invoice)}" oninput="UI.recv.invoice=this.value"></div>
  <div><label class="f" for="rExp">Quantity on invoice</label><input id="rExp" type="number" min="1" value="${esc(R.expected)}" oninput="UI.recv.expected=this.value"></div>${can('cost') ? `<div><label class="f" for="rCost">Unit cost for this delivery (GH₵)</label><input id="rCost" type="number" min="0" step="0.01" value="${esc(R.cost)}" placeholder="${S.costs['p:' + R.pid] ?? ''}" oninput="UI.recv.cost=this.value"></div>` : ''}</div></div></section>
  ${scanBtn('Scan serials', p.phone ? 'Scan each phone’s serial, then its IMEI.' : 'Continuous scanning. Duplicates are blocked.', `openScanner({title:'Scan serials',keepOpen:true,onScan:recvScan,help:'${esc(p.name || '').replace(/'/g, '')}'})`)}
  <section class="card" style="margin-top:16px"><div class="hd"><h2>No manufacturer serial?</h2></div><div class="bd"><p class="small muted">Generate PriceRight serials and print barcode labels to stick on each item before it goes on the shelf.</p><div class="row mt"><input id="lblN" type="number" min="1" max="200" placeholder="Number of labels" style="max-width:180px"><button class="btn" onclick="genLabels()">${ic('tag', 16)}Generate labels</button></div></div></section></div>
  <section class="card"><div class="hd"><h2>This delivery</h2><span class="sp"></span>${gap ? st(`${R.items.length} of ${R.expected}, short`, 'a') : (R.expected && R.items.length ? st(`${R.items.length} of ${R.expected}`, 'g') : `<span class="small muted">${R.items.length} scanned</span>`)}</div>
  ${R.items.length ? `<div class="tw"><table><tr><th>Serial</th>${p.phone ? '<th>IMEI</th>' : ''}<th>Captured</th><th></th></tr>${R.items.map((i, k) => `<tr><td>${sn(i.serial, i.method === 'manual' ? 'typed' : '')}</td>${p.phone ? `<td class="mono">${i.imei || '<span style="color:var(--red)">Missing</span>'}</td>` : ''}<td class="small">${i.method === 'label' ? 'Label' : i.method === 'manual' ? 'Typed' : 'Scanned'}</td><td class="num"><button class="btn ghost sm" onclick="UI.recv.items.splice(${k},1);render()" aria-label="Remove">${ic('x', 14)}</button></td></tr>`).join('')}</table></div>` : emptyBox('scan', 'Nothing scanned yet', 'Scanned serials appear here.')}
  <div class="bd" style="border-top:1px solid var(--line-2)">${gap ? `<label class="f" for="gapReason" style="margin-top:0">Reason for the shortfall${can('closeGap') ? '' : ' (owner or IT admin must save)'}</label><input id="gapReason" style="margin-bottom:12px">` : ''}
  <button class="btn pri block lg" onclick="act(this,submitBatch)" ${R.items.length ? '' : 'disabled'}>Add ${R.items.length || ''} to stock</button></div></section></div>
  <section class="card"><div class="hd"><h2>Recent deliveries</h2></div>${batches.length ? `<div class="tw"><table><tr><th>Batch</th><th>Product</th><th>Supplier</th><th>Invoice</th><th class="num">Units</th><th>Received</th></tr>${batches.map(b => `<tr><td class="mono">${b.id}</td><td>${esc(pname(b.pid))}</td><td>${esc(b.supplier)}</td><td>${esc(b.invoice)}</td><td class="num">${b.qty}${b.note ? `<div class="small muted">${esc(b.note)}</div>` : ''}</td><td class="small">${fmtT(b.t)}<br><span class="muted">${esc(b.by)}</span></td></tr>`).join('')}</table></div>` : emptyBox('inbox', 'No deliveries yet', 'Received batches are listed here.')}</section>`;
};
function genLabels() {
  const n = Math.min(200, Number(val('lblN')) || 0); if (!n) return toast('Enter how many labels you need.', 'err');
  const list = []; for (let i = 0; i < n; i++) { let s; do { s = 'PRT' + rnd(7) } while (S.units[s] || UI.recv.items.some(x => x.serial === s)); UI.recv.items.push({ serial: s, imei: '', method: 'label' }); list.push(s) }
  render(); showLabels(list);
}
function showLabels(list) {
  const p = prod(UI.recv.pid) || {};
  modal(`Print ${list.length} label${list.length > 1 ? 's' : ''}`, `<p class="small muted" style="margin-bottom:12px">Stick one on each item before it goes on the shelf. The serials are saved when you add the delivery to stock.</p><div class="labels" id="lblSheet">${list.map(s => `<div class="label"><b>PRICERIGHT TECH LTD</b><svg data-s="${s}"></svg><div>${esc((p.name || '').slice(0, 36))}</div></div>`).join('')}</div>`,
    `<button class="btn" onclick="$('#printArea').innerHTML=$('#lblSheet').outerHTML;window.print()">${ic('printer', 16)}Print labels</button><button class="btn dark" onclick="closeModal()">Done</button>`);
  document.querySelectorAll('#lblSheet svg').forEach(el => { try { JsBarcode(el, el.dataset.s, { format: 'CODE128', height: 40, fontSize: 12, margin: 0 }) } catch (e) { el.outerHTML = '<div class="mono">' + el.dataset.s + '</div>' } });
}
async function submitBatch() {
  const R = UI.recv, p = prod(R.pid);
  if (p.phone && R.items.some(i => !i.imei)) throw new Error('Scan the IMEI for every phone.');
  let note = '';
  if (R.expected && R.items.length < Number(R.expected)) { if (!can('closeGap')) throw new Error('This delivery is short. The owner or IT admin needs to save it with a reason.'); note = val('gapReason').trim(); if (!note) throw new Error('Add a reason for the shortfall.') }
  const id = uid('B'), t = Date.now();
  const units = R.items.map(i => ({ id: i.serial, serial: i.serial, imei: i.imei, pid: R.pid, status: 'in_stock', batch: id, source: i.method === 'label' ? 'PriceRight label' : 'Manufacturer', saleId: null, hist: [{ t, type: `Received in batch ${id}`, by: meName() }] }));
  const ch = { units, batches: [{ id, pid: R.pid, supplier: R.supplier.trim() || 'Not given', invoice: R.invoice.trim() || 'Not given', qty: units.length, expected: Number(R.expected) || null, t, by: meName(), note }], audit: [auditRec('Stock received', `${id}: ${units.length} × ${p.name}${note ? '. Short: ' + note : ''}`)] };
  R.items.filter(i => i.method === 'manual').forEach(i => ch.audit.push(auditRec('Serial typed at intake', i.serial)));
  if (can('cost') && R.cost !== '') ch.costs = units.map(u => ({ key: 'u:' + u.serial, cost: Number(R.cost) }));
  const r = await tx(ch, units.map(u => ({ serial: u.serial, absent: true })), { offline: true });
  const pid = R.pid; resetRecv(); UI.recv.pid = pid; toast(`${units.length} unit${units.length > 1 ? 's' : ''} added to stock${r.queued ? '. Syncs when online.' : ''}`, 'ok'); render();
}

/* ================= inventory ================= */
V.inventory = () => {
  const F = UI.invF, q = F.q.trim().toLowerCase();
  const list = vals('units').filter(u => (F.st === 'all' || u.status === F.st) && (!q || u.serial.toLowerCase().includes(q) || (u.imei || '').includes(q) || pname(u.pid).toLowerCase().includes(q)));
  const counts = {}; vals('units').forEach(u => counts[u.status] = (counts[u.status] || 0) + 1);
  return `<div class="kpis">${[['in_stock', 'In stock'], ['sold', 'Sold'], ['returned_inspection', 'Awaiting inspection'], ['faulty', 'Faulty or written off']].map(([k, l]) => `<div class="kpi"><div class="v">${k === 'faulty' ? (counts.faulty || 0) + (counts.written_off || 0) : counts[k] || 0}</div><div class="k">${l}</div></div>`).join('')}</div>
  <section class="card"><div class="hd"><div class="row" style="flex:1"><input placeholder="Serial, IMEI or product" value="${esc(F.q)}" onchange="UI.invF.q=this.value;render()" style="max-width:320px"><select style="max-width:220px" onchange="UI.invF.st=this.value;render()" aria-label="Status"><option value="all">All statuses</option>${Object.entries(UST).map(([k, v]) => `<option value="${k}" ${F.st === k ? 'selected' : ''}>${v[0]}</option>`).join('')}</select></div><span class="small muted">${list.length} unit${list.length === 1 ? '' : 's'}</span></div>
  ${list.length ? `<div class="tw"><table><tr><th>Serial</th><th>Product</th><th>Status</th><th>Source</th><th>Batch / sale</th></tr>${list.slice(0, 300).map(u => `<tr class="click" onclick="lookup('${u.serial}')"><td>${sn(u.serial)}${u.imei ? `<div class="small muted mono" style="margin-top:4px">IMEI ${esc(u.imei)}</div>` : ''}</td><td>${esc(pname(u.pid))}</td><td>${stU(u.status)}</td><td class="small">${esc(u.source)}</td><td class="small mono">${esc(u.batch)}${u.saleId ? '<br>' + esc(u.saleId) : ''}</td></tr>`).join('')}</table></div>${list.length > 300 ? '<p class="small muted" style="padding:10px 18px">Showing the first 300. Narrow the search to see more.</p>' : ''}` : emptyBox('layers', vals('units').length ? 'No units match' : 'No stock yet', vals('units').length ? 'Try another search.' : 'Receive stock to add serial-tracked units.', vals('units').length ? '' : `<a class="btn pri" href="#/receive">Receive stock</a>`)}</section>`;
};
function lookup(code) {
  const s = normSerial(code); const u = S.units[s] || vals('units').find(x => x.imei === String(code).trim());
  if (!u) return modal('No record found', `<div class="refuse">${ic('alert', 16)}<span>${sn(s, 'bad')} was never received by PriceRight Tech Ltd.</span></div>`, `<button class="btn dark" onclick="closeModal()">Close</button>`);
  const f = findSaleItem(u.serial), c = f && cust(f.sale.custId), cv = f && coverage(f.item, f.sale);
  const canChange = can('unitStatus') && ['in_stock', 'faulty', 'in_repair', 'returned_to_supplier', 'written_off'].includes(u.status);
  modal(esc(pname(u.pid)), `<div class="row" style="margin-bottom:16px">${sn(u.serial)}${stU(u.status)}</div>
  <dl class="kv" style="margin-bottom:20px">${u.imei ? `<div><dt>IMEI</dt><dd class="mono">${esc(u.imei)}</dd></div>` : ''}<div><dt>Serial source</dt><dd>${esc(u.source)}</dd></div><div><dt>Batch</dt><dd class="mono">${esc(u.batch)}</dd></div>${can('cost') ? `<div><dt>Unit cost</dt><dd>${money(unitCost(u))}</dd></div>` : ''}${f ? `<div><dt>Sold to</dt><dd>${esc(c && c.name)}<br><span class="small muted">${esc(c && c.phone)}</span></dd></div><div><dt>Sale</dt><dd class="mono">${f.sale.id}</dd></div><div><dt>Cover</dt><dd>${st(cv.label, cv.c)}</dd></div>` : ''}</dl>
  ${canChange ? `<div class="row" style="margin-bottom:18px"><select id="usSel" style="max-width:240px">${['in_stock', 'faulty', 'in_repair', 'returned_to_supplier', 'written_off'].map(k => `<option value="${k}" ${u.status === k ? 'selected' : ''}>${UST[k][0]}</option>`).join('')}</select><input id="usWhy" placeholder="Reason"><button class="btn" onclick="act(this,()=>changeUnit('${u.serial}'))">Update status</button></div>` : ''}
  <h3 style="margin-bottom:10px">History</h3><div class="tl">${(u.hist || []).slice().reverse().map(h => `<div><span class="strong">${esc(h.type)}</span><br><span class="small muted">${fmtT(h.t)}, ${esc(h.by)}</span></div>`).join('')}</div>`,
    `${f ? `<button class="btn" onclick="showReceipt('${f.sale.id}')">${ic('receipt', 16)}View receipt</button>` : ''}<button class="btn dark" onclick="closeModal()">Close</button>`);
}
async function changeUnit(serial) {
  const u = S.units[serial], to = val('usSel'), why = val('usWhy').trim(); if (to === u.status) return; if (!why) throw new Error('Add a reason.');
  await tx({ units: [{ ...u, status: to, hist: [...u.hist, { t: Date.now(), type: `${UST[to][0]}: ${why}`, by: meName() }] }], audit: [auditRec('Unit status changed', `${serial}: ${UST[u.status][0]} to ${UST[to][0]}. ${why}`)] }, [{ serial, expect: [u.status] }]);
  closeModal(); toast('Status updated', 'ok'); render();
}

/* ================= stock count ================= */
V.count = () => {
  const C = UI.count, exp = vals('units').filter(u => u.status === 'in_stock').map(u => u.serial);
  if (!C) return `<div class="pagehead"><p class="lede">Scan every unit on the shelf. You’ll see what’s missing and what shouldn’t be there.</p></div><div style="max-width:640px">${scanBtn('Start a stock count', `${exp.length} unit${exp.length === 1 ? '' : 's'} should be on the shelf.`, "UI.count={t:Date.now(),scanned:[],done:false};render()")}</div>`;
  if (!C.done) return `<div class="pagehead"><p class="lede"><b>${C.scanned.length}</b> of ${exp.length} expected units counted.</p></div><div style="max-width:720px">
  ${scanBtn('Scan the shelf', 'Keep scanning until every unit is counted.', "openScanner({title:'Scan the shelf',keepOpen:true,onScan:countScan})")}
  <div class="row mt"><button class="btn dark" onclick="UI.count.done=true;render()">Finish count</button><button class="btn ghost" onclick="if(confirm('Discard this count?')){UI.count=null;render()}">Discard count</button></div>
  ${C.scanned.length ? `<section class="card" style="margin-top:16px"><div class="bd sns" style="margin:0">${C.scanned.map(s => sn(s, exp.includes(s) ? 'ok' : 'bad')).join('')}</div></section>` : ''}</div>`;
  const miss = exp.filter(s => !C.scanned.includes(s)), unexp = C.scanned.filter(s => !exp.includes(s)), found = C.scanned.filter(s => exp.includes(s));
  return `<div class="kpis" style="grid-template-columns:repeat(3,1fr)"><div class="kpi"><div class="v" style="color:var(--green)">${found.length}</div><div class="k">Found</div></div><div class="kpi"><div class="v" style="color:var(--red)">${miss.length}</div><div class="k">Missing</div></div><div class="kpi"><div class="v" style="color:var(--amber)">${unexp.length}</div><div class="k">Unexpected</div></div></div>
  <div class="cols c2"><section class="card"><div class="hd"><h2>Missing</h2><span class="sp"></span>${miss.length && can('writeOff') ? `<button class="btn danger sm" onclick="act(this,writeOff)">Write off missing</button>` : ''}</div>${miss.length ? `<div class="list">${miss.map(s => `<div>${sn(s, 'bad')}<span class="small sp">${esc(pname(S.units[s].pid))}</span></div>`).join('')}</div>` : emptyBox('check', 'Nothing missing', 'Every expected unit was found.')}</section>
  <section class="card"><div class="hd"><h2>Unexpected</h2></div>${unexp.length ? `<div class="list">${unexp.map(s => { const u = S.units[s]; return `<div>${sn(s, 'typed')}<span class="small sp">${u ? esc(pname(u.pid)) + ', ' + UST[u.status][0] : 'Not in the system'}</span></div>` }).join('')}</div>` : emptyBox('check', 'Nothing unexpected', 'No stray units on the shelf.')}</section></div>
  <button class="btn" onclick="act(this,closeCount)">Close count</button>`;
};
function countScan(code) { if (UI.count.scanned.includes(code)) return { ok: false, msg: 'Already counted' }; UI.count.scanned.push(code); const u = S.units[code]; return u && u.status === 'in_stock' ? { ok: true, msg: pname(u.pid) } : { ok: true, msg: u ? 'Unexpected: ' + UST[u.status][0] : 'Unexpected: not in the system' } }
async function closeCount() { const C = UI.count, exp = vals('units').filter(u => u.status === 'in_stock').map(u => u.serial); await tx({ audit: [auditRec('Stock count', `${C.scanned.filter(s => exp.includes(s)).length} found, ${exp.filter(s => !C.scanned.includes(s)).length} missing, ${C.scanned.filter(s => !exp.includes(s)).length} unexpected`)] }, [], { offline: true }); UI.count = null; render() }
async function writeOff() {
  const ex = vals('units').filter(u => u.status === 'in_stock' && !UI.count.scanned.includes(u.serial)); if (!confirm(`Write off ${ex.length} missing unit(s)?`)) return;
  await tx({ units: ex.map(u => ({ ...u, status: 'written_off', hist: [...u.hist, { t: Date.now(), type: 'Written off after stock count', by: meName() }] })), audit: [auditRec('Units written off', ex.map(u => u.serial).join(', '))] }, ex.map(u => ({ serial: u.serial, expect: ['in_stock'] })));
  toast(`${ex.length} unit${ex.length === 1 ? '' : 's'} written off`); render();
}

/* ================= returns ================= */
const REASONS = ['Won’t power on', 'Screen or display fault', 'Battery or charging fault', 'Camera or video fault', 'Overheating', 'Wrong item or changed mind', 'Other'];
function staffVerify(code) {
  const u = S.units[code]; if (!u) return { ok: false, msg: 'No record. This serial was never received by the shop.' };
  if (u.status === 'in_stock') return { ok: false, msg: 'This unit hasn’t been sold. It’s still in stock.' };
  const f = findSaleItem(code); if (u.status !== 'sold' || !f) return { ok: false, msg: 'Can’t be returned. Current status: ' + UST[u.status][0] };
  if (vals('returns').some(r => r.serial === code && !['resolved', 'rejected'].includes(r.status))) return { ok: false, msg: 'A return is already open for this serial.' };
  return { ok: true, u, sale: f.sale, item: f.item, c: cust(f.sale.custId), cov: coverage(f.item, f.sale) };
}
V['file-return'] = () => {
  const F = UI.fr;
  if (!F) return `<div class="pagehead"><p class="lede">Scan the serial on the device the customer brought in. The serial is the only proof accepted.</p></div><div style="max-width:680px">
  ${scanBtn('Scan the device', 'Sold serials are verified against the original sale.', "openScanner({title:'Scan the returned device',onScan:frScan})")}
  <section class="card" style="margin-top:18px"><div class="hd"><h2>Recent returns</h2><span class="sp"></span><a class="btn ghost sm" href="#/returns">Returns desk${ic('chev', 14)}</a></div>${vals('returns').length ? `<div class="list">${vals('returns').sort((a, b) => b.t - a.t).slice(0, 6).map(r => `<div style="cursor:pointer" onclick="viewReturn('${r.id}')"><span class="mono strong">${r.id}</span>${sn(r.serial)}<span class="sp"></span>${st(RST[r.status][0], RST[r.status][1])}</div>`).join('')}</div>` : emptyBox('undo', 'No returns yet', 'Returns logged here and online appear on the returns desk.')}</section></div>`;
  const v = F.v, p = prod(v.u.pid) || {};
  return `<div style="max-width:760px"><div class="verify"><div class="t">${ic('shield', 18)}Serial verified</div><dl class="kv"><div><dt>Device</dt><dd>${esc(p.name)}<br>${sn(v.u.serial, 'ok')}</dd></div><div><dt>Customer</dt><dd>${esc(v.c && v.c.name)}<br><span class="small muted">${esc(v.c && v.c.phone)}</span></dd></div><div><dt>Bought</dt><dd>${fmtD(v.sale.t)}, <span class="mono">${v.sale.id}</span></dd></div><div><dt>Cover</dt><dd>${st(v.cov.label, v.cov.c)}</dd></div></dl></div>
  ${p.phone && v.u.imei ? `<section class="card"><div class="hd"><h2>Confirm the IMEI</h2><span class="sp"></span>${F.imeiOk ? st('Matches', 'g') : ''}</div><div class="bd">${F.imeiOk ? '<p class="small muted">The IMEI matches the one recorded for this serial.</p>' : `<p class="small muted" style="margin-bottom:12px">Dial *#06# on the phone or scan the IMEI on its tray. It must match the IMEI recorded when the phone was received.</p><button class="btn pri" onclick="openScanner({title:'Scan the IMEI',onScan:frImei})">${ic('scan', 16)}Scan IMEI</button>`}</div></section>` : ''}
  <section class="card"><div class="hd"><h2>What’s wrong</h2></div><div class="bd"><label class="f" for="frR" style="margin-top:0">Reason</label><select id="frR">${REASONS.map(o => `<option>${o}</option>`).join('')}</select>
  <label class="f" for="frD">What the customer describes</label><textarea id="frD" rows="3"></textarea>
  <label class="f" for="frP">Photos of the fault</label><input type="file" accept="image/*" multiple id="frP">
  ${v.cov.k === 'expired' ? '<p class="hint" style="color:var(--red)">Out of warranty. You can still log it. The owner decides.</p>' : ''}</div>
  <div class="ft"><button class="btn" onclick="UI.fr=null;render()">Cancel</button><button class="btn pri" onclick="act(this,submitShopReturn)" ${p.phone && v.u.imei && !F.imeiOk ? 'disabled' : ''}>Log return</button></div></section></div>`;
};
function frScan(code, method) { const v = staffVerify(code); if (!v.ok) return v; UI.fr = { v, imeiOk: false, method }; return { ok: true, msg: 'Verified: ' + pname(v.u.pid) } }
function frImei(code) { if (code === UI.fr.v.u.imei) { UI.fr.imeiOk = true; return { ok: true, msg: 'IMEI matches' } } return { ok: false, msg: 'This IMEI doesn’t match the serial. The return is blocked.' } }
async function uploadMany(input, bucket) { const out = []; for (const f of [...(input && input.files || [])].slice(0, 6)) out.push(await uploadImage(f, bucket, 1200)); return out }
async function submitShopReturn() {
  const F = UI.fr, v = F.v, photos = await uploadMany($('#frP'), 'return-photos'), id = uid('RMA'), t = Date.now();
  const r = { id, rma: id, serial: v.u.serial, pid: v.u.pid, saleRef: v.sale.id, custId: v.c && v.c.id, channel: 'in_shop', status: 'verified', receivedSerial: v.u.serial, entry: F.method, reason: val('frR'), desc: val('frD').trim(), photos, cov: v.cov.label, covK: v.cov.k, t, events: [{ t, s: 'Device received and serial verified in shop', by: meName() }] };
  const u = { ...v.u, status: 'returned_inspection', hist: [...v.u.hist, { t, type: `Returned in shop, ${id}`, by: meName() }] };
  await tx({ returns: [r], units: [u], audit: [auditRec('Return logged in shop', `${id}, ${r.serial}${F.method === 'manual' ? ', serial typed' : ''}`)] }, [{ serial: u.serial, expect: ['sold'] }], { offline: true });
  UI.fr = null; toast(`${id} logged. The owner decides the outcome.`, 'ok'); go('returns');
}
V.returns = () => {
  const list = vals('returns').sort((a, b) => b.t - a.t), insp = vals('units').filter(u => u.status === 'returned_inspection' || u.status === 'in_repair');
  return `<div class="pagehead"><p class="lede">Online claims wait until the device arrives and its serial matches the claim. Only the shop owner decides the outcome.</p><span class="sp"></span><a class="btn pri" href="#/file-return">${ic('plus', 16)}File a return</a></div>
  <section class="card">${list.length ? `<div class="tw"><table><tr><th>Return</th><th>Device</th><th>Customer</th><th>Cover</th><th>Status</th><th></th></tr>${list.map(r => `<tr><td><span class="mono strong">${r.id}</span><div class="small muted">${fmtD(r.t)}, ${r.channel === 'online' ? 'online' : 'in shop'}</div></td><td>${sn(r.serial, r.entry === 'manual' ? 'typed' : '')}<div class="small" style="margin-top:4px">${esc(pname(r.pid))}</div><div class="small muted">${esc(r.reason)}</div></td><td>${esc((cust(r.custId) || {}).name || '')}</td><td class="small">${esc(r.cov)}</td><td>${st(RST[r.status][0], RST[r.status][1])}${r.resolution ? `<div class="small muted" style="margin-top:4px">${esc(r.resolution)}</div>` : ''}</td><td class="num"><div class="row end">${r.status === 'submitted' ? `<button class="btn sm pri" onclick="scanReceived('${r.id}')">${ic('scan', 14)}Check device</button>` : ''}${r.status === 'verified' && can('decide') ? `<button class="btn sm pri" onclick="decide('${r.id}')">Decide</button>` : ''}<button class="btn sm" onclick="viewReturn('${r.id}')">Details</button></div></td></tr>`).join('')}</table></div>` : emptyBox('tool', 'No returns', 'Returns filed in the shop or online appear here.')}</section>
  <section class="card"><div class="hd"><h2>Returned units</h2><span class="sp"></span><span class="small muted">Nothing goes back on the shelf without an inspection</span></div>${insp.length ? `<div class="list">${insp.map(u => { const rep = vals('returns').some(r => r.serial === u.serial && (r.resolution || '').startsWith('Repair')); return `<div>${sn(u.serial)}<span class="small sp">${esc(pname(u.pid))}</span>${stU(u.status)}${can('inspect') ? `<select style="max-width:220px;min-height:34px" onchange="if(this.value)act(null,()=>inspect('${u.serial}',this.value))" aria-label="Inspection result"><option value="">Inspection result</option>${u.status === 'in_repair' && rep ? '<option value="back_to_customer">Repaired, hand back</option>' : ''}<option value="in_stock">Back in stock</option><option value="in_repair">In repair</option><option value="faulty">Faulty</option><option value="returned_to_supplier">Return to supplier</option><option value="written_off">Write off</option></select>` : ''}</div>` }).join('')}</div>` : emptyBox('check', 'Nothing to inspect', 'Returned units wait here until someone inspects them.')}</section>`;
};
function scanReceived(id) {
  const r = S.returns[id];
  openScanner({
    title: `Check the device for ${id}`, help: `The claim is for ${sn(r.serial)}. Any other serial is refused.`, onScan: async code => {
      if (code !== r.serial) { await tx({ returns: [{ ...r, events: [...r.events, { t: Date.now(), s: `Device refused. Scanned ${code}, which doesn’t match the claim.`, by: meName() }] }], audit: [auditRec('Device mismatch on return', `${id}: claimed ${r.serial}, received ${code}`)] }); return { ok: false, msg: 'This isn’t the device on the claim. The return can’t continue.' } }
      const u = S.units[code], t = Date.now();
      await tx({ returns: [{ ...S.returns[id], status: 'verified', receivedSerial: code, events: [...S.returns[id].events, { t, s: 'Device received and serial verified', by: meName() }] }], units: [{ ...u, status: 'returned_inspection', hist: [...u.hist, { t, type: `Received for ${id}`, by: meName() }] }], audit: [auditRec('Returned device verified', id)] }, [{ serial: code, expect: ['sold'] }]);
      return { ok: true, msg: 'Serial matches the claim' };
    }
  });
}
function decide(id) {
  const r = S.returns[id];
  modal(`Decide ${id}`, `<div class="row" style="margin-bottom:10px">${sn(r.serial, 'ok')}<span class="small">${esc(pname(r.pid))}</span></div><p class="small muted">${esc(r.reason)}${r.desc ? ': ' + esc(r.desc) : ''}</p><p style="margin-top:10px">${st(r.cov, r.covK === 'window' ? 'g' : r.covK === 'warranty' ? 'b' : 'r')}</p>
  <label class="f" for="dOut">Outcome</label><select id="dOut"><option value="refund">Refund the customer</option><option value="replace">Replace with a new unit</option><option value="repair">Repair and return it</option><option value="reject">Reject the return</option></select>
  <label class="f" for="dNote">Note to the customer</label><textarea id="dNote" rows="2"></textarea>`,
    `<button class="btn" onclick="closeModal()">Cancel</button><button class="btn pri" onclick="act(this,()=>applyDecision('${id}'))">Confirm outcome</button>`);
}
async function applyDecision(id) {
  const r = S.returns[id], out = val('dOut'), note = val('dNote').trim(), u = S.units[r.serial], f = findSaleItem(r.serial), sale = f && f.sale, t = Date.now();
  if (out === 'reject' && !note) throw new Error('Tell the customer why it was rejected.');
  const ev = s => ({ ...r, events: [...r.events, { t, s: s + (note ? '. ' + note : ''), by: meName() }] });
  if (out === 'replace') {
    closeModal(); setTimeout(() => openScanner({
      title: 'Scan the replacement unit', help: `It must be an in-stock ${esc(pname(r.pid))}.`, onScan: async code => {
        const n = S.units[code]; if (!n || n.status !== 'in_stock') return { ok: false, msg: 'The replacement must be an in-stock unit' }; if (n.pid !== r.pid) return { ok: false, msg: 'It must be the same product' };
        const items = sale.items.map(i => i === f.item ? { ...i, returned: true } : i).concat([{ pid: n.pid, serial: n.serial, price: f.item.price, wEnd: f.item.wEnd, replacementFor: r.serial }]);
        await tx({ sales: [{ ...sale, items }], units: [{ ...n, status: 'sold', saleId: sale.id, hist: [...n.hist, { t, type: `Issued as replacement on ${id}`, by: meName() }] }, { ...u, hist: [...u.hist, { t, type: `Replaced by ${n.serial} on ${id}`, by: meName() }] }], returns: [{ ...ev(`Replaced with ${n.serial}`), status: 'resolved', resolution: `Replaced with ${n.serial}` }], audit: [auditRec('Return resolved', `${id}: replaced with ${n.serial}`)] }, [{ serial: code, expect: ['in_stock'] }]);
        return { ok: true, msg: 'Replacement issued. The warranty moved to the new unit.' };
      }
    }), 250); return;
  }
  const ch = { audit: [] };
  if (out === 'refund') { const amt = f.item.price; ch.sales = [{ ...sale, items: sale.items.map(i => i === f.item ? { ...i, returned: true } : i), refunds: [...(sale.refunds || []), { serial: r.serial, amount: amt, t }] }]; ch.units = [{ ...u, hist: [...u.hist, { t, type: `Refunded ${money(amt)} on ${id}`, by: meName() }] }]; ch.returns = [{ ...ev(`Refunded ${money(amt)}`), status: 'resolved', resolution: `Refunded ${money(amt)}` }]; ch.audit.push(auditRec('Refund issued', `${id}: ${money(amt)}`)) }
  if (out === 'repair') { ch.units = [{ ...u, status: 'in_repair', hist: [...u.hist, { t, type: `Sent for repair on ${id}`, by: meName() }] }]; ch.returns = [{ ...ev('Repair, then return to the customer'), status: 'resolved', resolution: 'Repair, then return to the customer' }]; ch.audit.push(auditRec('Return resolved', `${id}: repair`)) }
  if (out === 'reject') { ch.units = [{ ...u, status: 'sold', hist: [...u.hist, { t, type: `Return rejected, device given back (${id})`, by: meName() }] }]; ch.returns = [{ ...ev('Rejected'), status: 'rejected', resolution: 'Rejected: ' + note }]; ch.audit.push(auditRec('Return rejected', id)) }
  await tx(ch); closeModal(); toast(`${id}: ${ch.returns[0].resolution}`, 'ok'); render();
}
async function inspect(serial, to) {
  const u = S.units[serial], t = Date.now();
  if (to === 'back_to_customer') { await tx({ units: [{ ...u, status: 'sold', hist: [...u.hist, { t, type: 'Repaired and handed back to the customer', by: meName() }] }], audit: [auditRec('Repair completed', serial)] }); return render() }
  const ch = { units: [{ ...u, status: to, saleId: to === 'in_stock' ? null : u.saleId, hist: [...u.hist, { t, type: 'Inspection: ' + UST[to][0], by: meName() }] }], audit: [auditRec('Unit inspected', `${serial}: ${UST[to][0]}`)] };
  if (to === 'in_stock') { const f = findSaleItem(serial); if (f) ch.sales = [{ ...f.sale, items: f.sale.items.map(i => i === f.item ? { ...i, returned: true } : i) }] }
  await tx(ch, [{ serial, expect: [u.status] }]); toast('Inspection saved', 'ok'); render();
}
async function viewReturn(id) {
  const r = S.returns[id]; const photos = REMOTE ? await Promise.all((r.photos || []).map(photoUrl)) : (r.photos || []);
  modal(esc(id), `<div class="row" style="margin-bottom:14px">${sn(r.serial)}${st(RST[r.status][0], RST[r.status][1])}</div><dl class="kv" style="margin-bottom:18px"><div><dt>Device</dt><dd>${esc(pname(r.pid))}</dd></div><div><dt>Customer</dt><dd>${esc((cust(r.custId) || {}).name || '')}<br><span class="small muted">${esc((cust(r.custId) || {}).phone || '')}</span></dd></div><div><dt>Filed</dt><dd>${r.channel === 'online' ? 'Online by the customer' : 'In shop'}</dd></div><div><dt>Original sale</dt><dd class="mono">${esc(r.saleRef)}</dd></div><div><dt>Reason</dt><dd>${esc(r.reason)}</dd></div><div><dt>Cover</dt><dd>${esc(r.cov)}</dd></div></dl>${r.desc ? `<p style="margin-bottom:16px">${esc(r.desc)}</p>` : ''}
  ${photos.length ? `<div class="row" style="margin-bottom:18px">${photos.map(p => `<a href="${esc(p)}" target="_blank" rel="noopener" class="thumb" style="width:96px;height:72px"><img src="${esc(p)}" alt="Fault photo"></a>`).join('')}</div>` : ''}
  <h3 style="margin-bottom:10px">History</h3><div class="tl">${r.events.slice().reverse().map(e => `<div><span class="strong">${esc(e.s)}</span><br><span class="small muted">${fmtT(e.t)}, ${esc(e.by)}</span></div>`).join('')}</div>`, `<button class="btn dark" onclick="closeModal()">Close</button>`);
}

/* ================= online orders ================= */
V.orders = () => {
  const tabs = [['pack', 'To pack', ['paid', 'pod']], ['ready', 'Ready to send', ['packed']], ['out', 'On the way', ['out']], ['done', 'Completed', ['delivered', 'cancelled']]];
  const tab = tabs.find(t => t[0] === UI.ordTab) || tabs[0];
  const list = vals('orders').filter(o => tab[2].includes(o.status)).sort((a, b) => tab[0] === 'done' ? b.t - a.t : a.t - b.t);
  const riders = set_('riders');
  return `<div class="tabs" role="tablist">${tabs.map(([k, l, s]) => { const n = vals('orders').filter(o => s.includes(o.status)).length; return `<button class="${tab[0] === k ? 'on' : ''}" onclick="UI.ordTab='${k}';render()">${l}${k !== 'done' && n ? ` (${n})` : ''}</button>` }).join('')}</div>
  ${list.length ? list.map(o => { const c = cust(o.custId) || {}, need = o.items.reduce((a, i) => a + Number(i.qty), 0); return `<section class="card"><div class="hd"><span class="mono strong">${o.id}</span>${st(OST[o.status][0], OST[o.status][1])}<span class="sp"></span><span class="small muted">${fmtT(o.t)}</span></div>
  <div class="bd"><div class="cols c3"><div><div class="small muted">Customer</div><div class="strong">${esc(c.name)}</div><div class="small"><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a>${c.email ? '<br>' + esc(c.email) : ''}</div></div>
  <div><div class="small muted">Deliver to</div><div class="strong">${esc(o.area)}</div><div class="small">${esc(o.landmark)}</div>${o.rider ? `<div class="small" style="margin-top:4px">Rider: ${esc(o.rider)}</div>` : ''}</div>
  <div><div class="small muted">Items</div>${o.items.map(i => `<div class="small">${i.qty} × ${esc(pname(i.pid))}</div>`).join('')}<div class="small strong" style="margin-top:4px">${money(o.total)} incl. ${money(o.fee)} delivery</div><div class="small muted">${o.payment === 'paystack' ? 'Paid with Paystack, ref ' + esc(o.ref) : 'Customer pays on delivery'}</div></div></div>
  ${o.serials && o.serials.length ? `<div class="sns" style="margin-top:14px">${o.serials.map(s => sn(s, 'ok')).join('')}</div>` : ''}</div>
  <div class="ft">${['paid', 'pod'].includes(o.status) && can('cancelOrder') ? `<button class="btn danger" onclick="act(this,()=>cancelOrder('${o.id}'))">Cancel order</button>` : ''}
  ${['paid', 'pod'].includes(o.status) ? `<button class="btn pri" onclick="fulfil('${o.id}')">${ic('scan', 16)}Pack: scan ${need} serial${need > 1 ? 's' : ''}</button>` : ''}
  ${o.status === 'packed' ? (riders.length ? `<select onchange="if(this.value)act(null,()=>assignRider('${o.id}',this.value))" style="max-width:220px" aria-label="Assign rider"><option value="">Assign a rider</option>${riders.map(r => `<option>${esc(r)}</option>`).join('')}</select>` : `<span class="small muted">Add riders in Settings to dispatch.</span>`) : ''}
  ${o.status === 'out' ? `<button class="btn pri" onclick="delivered('${o.id}')">${ic('check', 16)}Mark delivered</button>` : ''}
  ${o.saleId ? `<button class="btn" onclick="showReceipt('${o.saleId}')">${ic('receipt', 16)}Receipt</button>` : ''}</div></section>` }).join('') : `<section class="card">${emptyBox('truck', 'Nothing here', tab[0] === 'pack' ? 'New online orders appear here for packing.' : 'Orders move here as they progress.')}</section>`}`;
};
function fulfil(id) {
  const o = S.orders[id], left = {}; o.items.forEach(i => left[i.pid] = (left[i.pid] || 0) + Number(i.qty)); const got = [];
  openScanner({
    title: `Pack ${id}`, keepOpen: true, help: 'Scan each unit as it goes into the box.', onScan: async code => {
      const u = S.units[code]; if (!u) return { ok: false, msg: 'Unknown serial' }; if (u.status !== 'in_stock') return { ok: false, msg: 'Refused: ' + UST[u.status][0] }; if (got.includes(code)) return { ok: false, msg: 'Already scanned' };
      if (!left[u.pid]) return { ok: false, msg: 'Not on this order, or enough of this product scanned' };
      left[u.pid]--; got.push(code);
      if (Object.values(left).some(v => v > 0)) return { ok: true, msg: `${pname(u.pid)}. ${Object.values(left).reduce((a, b) => a + b, 0)} left to scan.` };
      const t = Date.now(), sid = uid('R'), c = cust(o.custId);
      const items = got.map(s => { const x = S.units[s], line = o.items.find(i => i.pid === x.pid), p = prod(x.pid) || {}; return { pid: x.pid, serial: s, price: line ? line.price : p.price, wEnd: addMonths(t, p.w ?? 12) } });
      const sub = items.reduce((a, i) => a + i.price, 0);
      const sale = { id: sid, no: sid, channel: 'online', orderNo: id, custId: o.custId, staff: meName(), staffEmail: ME.email, items, subtotal: sub, discount: 0, fee: o.fee, total: sub + o.fee, pay: o.payment === 'paystack' ? [{ method: 'paystack', amount: sub + o.fee, ref: o.ref }] : [], payStatus: o.payment === 'paystack' ? 'paid' : 'due', status: 'completed', t, refunds: [] };
      try {
        await tx({ sales: [sale], orders: [{ ...o, status: 'packed', serials: got, saleId: sid }], units: got.map(s => { const x = S.units[s]; return { ...x, status: 'sold', saleId: sid, hist: [...x.hist, { t, type: `Sold online, ${id} / ${sid}`, by: meName() }] } }), audit: [auditRec('Online order packed', `${id}, receipt ${sid}`)] }, got.map(s => ({ serial: s, expect: ['in_stock'] })));
      } catch (e) { got.length = 0; o.items.forEach(i => left[i.pid] = Number(i.qty)); throw e }
      setTimeout(closeModal, 600); emailReceipt({ sale: sid }, true); return { ok: true, msg: 'All items scanned. Order packed.' };
    }
  });
}
async function assignRider(id, r) { await tx({ orders: [{ ...S.orders[id], status: 'out', rider: r }], audit: [auditRec('Rider assigned', `${id}: ${r}`)] }); toast(`${id} is on the way`, 'ok'); render() }
function delivered(id) {
  const o = S.orders[id], s = S.sales[o.saleId];
  if (s && s.payStatus === 'due') return modal(`Confirm payment for ${id}`, `<p style="margin-bottom:14px">The customer pays <b>${money(s.total)}</b> on delivery. How did they pay?</p><div class="seg" id="dlSeg">${['cash', 'momo'].map((k, i) => `<button class="${i ? '' : 'on'}" data-m="${k}" onclick="document.querySelectorAll('#dlSeg button').forEach(b=>b.classList.toggle('on',b===this))">${k === 'cash' ? 'Cash' : 'MoMo'}</button>`).join('')}</div><label class="f" for="dlRef">MoMo transaction ID (if MoMo)</label><input id="dlRef" class="mono">`,
    `<button class="btn" onclick="closeModal()">Cancel</button><button class="btn pri" onclick="act(this,()=>finishDelivery('${id}'))">Mark delivered and paid</button>`);
  act(null, () => finishDelivery(id));
}
async function finishDelivery(id) {
  const o = S.orders[id], s = S.sales[o.saleId], ch = { orders: [{ ...o, status: 'delivered', deliveredAt: Date.now() }], audit: [auditRec('Order delivered', id)] };
  if (s && s.payStatus === 'due') { const m = (document.querySelector('#dlSeg .on') || {}).dataset?.m || 'cash', ref = val('dlRef').trim(); if (m === 'momo' && !ref) throw new Error('Add the MoMo transaction ID.'); ch.sales = [{ ...s, payStatus: 'paid', pay: [{ method: m, amount: s.total, ref }] }] }
  await tx(ch); closeModal(); toast(`${id} delivered`, 'ok'); render();
}
async function cancelOrder(id) { const why = prompt('Cancel this order? Reason:'); if (why === null) return; if (!why.trim()) throw new Error('Add a reason.'); await tx({ orders: [{ ...S.orders[id], status: 'cancelled', cancelReason: why.trim() }], audit: [auditRec('Order cancelled', `${id}: ${why.trim()}`)] }); toast(`${id} cancelled`); render() }

/* ================= customers ================= */
V.customers = () => {
  const q = UI.custQ.trim().toLowerCase(), list = vals('customers').filter(c => !q || [c.name, c.email, c.location].join(' ').toLowerCase().includes(q) || (normPhone(q) && normPhone(c.phone).includes(normPhone(q)))).sort((a, b) => a.name.localeCompare(b.name));
  return `<section class="card"><div class="hd"><input placeholder="Search name, phone or email" value="${esc(UI.custQ)}" onchange="UI.custQ=this.value;render()" style="max-width:340px"><span class="sp"></span><span class="small muted">${list.length} customer${list.length === 1 ? '' : 's'}</span></div>
  ${list.length ? `<div class="tw"><table><tr><th>Customer</th><th>Contact</th><th class="num">Purchases</th><th class="num">Devices</th>${can('allSales') ? '<th class="num">Spent</th>' : ''}</tr>${list.slice(0, 300).map(c => { const sales = vals('sales').filter(s => s.custId === c.id && s.status !== 'voided'); return `<tr class="click" onclick="viewCustomer('${c.id}')"><td><span class="strong">${esc(c.name)}</span><div class="small muted">${esc(c.location || '')}</div></td><td class="small">${esc(c.phone)}${c.email ? '<br>' + esc(c.email) : ''}</td><td class="num">${sales.length}</td><td class="num">${sales.flatMap(s => s.items.filter(i => !i.returned)).length}</td>${can('allSales') ? `<td class="num">${money(sales.reduce((a, s) => a + netOf(s), 0))}</td>` : ''}</tr>` }).join('')}</table></div>` : emptyBox('users', 'No customers yet', 'Customers are saved automatically from sales and online orders.')}</section>`;
};
function viewCustomer(id) {
  const c = cust(id), sales = vals('sales').filter(s => s.custId === id).sort((a, b) => b.t - a.t), items = sales.filter(s => s.status !== 'voided').flatMap(s => s.items.filter(i => !i.returned).map(i => ({ i, s })));
  modal(esc(c.name), `<div class="fgrid"><div><label class="f" for="cuN" style="margin-top:0">Name</label><input id="cuN" value="${esc(c.name)}"></div><div><label class="f" for="cuP" style="margin-top:0">Phone</label><input id="cuP" value="${esc(c.phone)}"></div><div><label class="f" for="cuE">Email</label><input id="cuE" value="${esc(c.email || '')}"></div><div><label class="f" for="cuL">Location</label><input id="cuL" value="${esc(c.location || '')}"></div></div>
  <h3 style="margin:22px 0 10px">Devices</h3>${items.length ? items.map(({ i, s }) => `<div class="line"><div class="grow"><span class="strong">${esc(pname(i.pid))}</span><div class="row" style="margin-top:6px">${sn(i.serial)}<span class="small muted">${st(coverage(i, s).label, coverage(i, s).c)}</span></div></div></div>`).join('') : '<p class="muted">No devices.</p>'}
  <h3 style="margin:22px 0 10px">Receipts</h3>${sales.length ? sales.map(s => `<div class="line" style="cursor:pointer" onclick="showReceipt('${s.id}')"><div class="grow"><span class="mono strong">${s.id}</span><div class="small muted">${fmtT(s.t)}</div></div>${saleSt(s)}<span class="strong">${money(s.total)}</span></div>`).join('') : '<p class="muted">No receipts.</p>'}`,
    `<button class="btn" onclick="closeModal()">Close</button><button class="btn pri" onclick="act(this,async()=>{if(!val('cuN').trim()||normPhone(val('cuP')).length<9)throw new Error('Name and phone are required.');await tx({customers:[{...cust('${id}'),name:val('cuN').trim(),phone:val('cuP').trim(),email:val('cuE').trim(),location:val('cuL').trim()}],audit:[auditRec('Customer updated','${id}')]});closeModal();toast('Customer saved','ok');render()})">Save</button>`, { wide: true });
}

/* ================= reports ================= */
V.reports = () => {
  const days = UI.rep, from = startOfDay(Date.now()) - (days - 1) * DAY, live = vals('sales').filter(s => s.status !== 'voided' && s.t >= from);
  const net = live.reduce((a, s) => a + netOf(s), 0), items = live.flatMap(s => s.items.filter(i => !i.returned).map(i => ({ ...i, s })));
  const cogs = items.reduce((a, i) => a + unitCost(S.units[i.serial] || { serial: i.serial, pid: i.pid }), 0), fees = live.reduce((a, s) => a + (s.fee || 0), 0);
  const byP = {}; items.forEach(i => { const b = byP[i.pid] = byP[i.pid] || { n: 0, v: 0, c: 0 }; b.n++; b.v += i.price; b.c += unitCost(S.units[i.serial] || { serial: i.serial, pid: i.pid }) });
  const retBy = {}; vals('returns').filter(r => r.t >= from).forEach(r => retBy[r.pid] = (retBy[r.pid] || 0) + 1);
  const byStaff = {}; live.forEach(s => { const b = byStaff[s.staff] = byStaff[s.staff] || { n: 0, v: 0, d: 0 }; b.n++; b.v += netOf(s); b.d += s.discount || 0 });
  const byPay = {}; live.forEach(s => s.pay.filter(p => p.method !== 'refund').forEach(p => byPay[p.method] = (byPay[p.method] || 0) + p.amount));
  const PAY = { cash: 'Cash', momo: 'Mobile money', card: 'Card', paystack: 'Paystack (online)' };
  const top = Object.entries(byP).sort((a, b) => b[1].v - a[1].v);
  return `<div class="pagehead"><div class="seg" style="width:min(360px,100%)">${[[7, '7 days'], [30, '30 days'], [90, '90 days']].map(([k, l]) => `<button class="${days === k ? 'on' : ''}" onclick="UI.rep=${k};render()">${l}</button>`).join('')}</div><span class="sp"></span><button class="btn" onclick="exportSales()">${ic('download', 16)}Export sales CSV</button></div>
  <div class="kpis"><div class="kpi"><div class="v">${money(net)}</div><div class="k">Net sales</div></div><div class="kpi"><div class="v">${money(net - cogs - fees)}</div><div class="k">Gross profit${net ? `, ${Math.round((net - cogs - fees) / net * 100)}% margin` : ''}</div></div><div class="kpi"><div class="v">${items.length}</div><div class="k">Units sold</div></div><div class="kpi"><div class="v">${money(live.length ? net / live.length : 0)}</div><div class="k">Average sale, ${live.length} receipts</div></div></div>
  <section class="card"><div class="hd"><h2>Net sales by day</h2></div><div class="chart">${barChart(dailySeries(days))}</div></section>
  <div class="cols c-main"><section class="card"><div class="hd"><h2>Products</h2></div>${top.length ? `<div class="tw"><table><tr><th>Product</th><th class="num">Sold</th><th class="num">Sales</th><th class="num">Profit</th><th class="num">Returns</th></tr>${top.map(([pid, b]) => `<tr><td>${esc(pname(pid))}</td><td class="num">${b.n}</td><td class="num">${money(b.v)}</td><td class="num">${money(b.v - b.c)}</td><td class="num">${retBy[pid] || 0}${b.n ? ` <span class="muted small">(${Math.round((retBy[pid] || 0) / b.n * 100)}%)</span>` : ''}</td></tr>`).join('')}</table></div>` : emptyBox('chart', 'No sales in this period', 'Product performance shows here.')}</section>
  <div><section class="card"><div class="hd"><h2>By staff</h2></div>${Object.keys(byStaff).length ? `<div class="list">${Object.entries(byStaff).sort((a, b) => b[1].v - a[1].v).map(([k, b]) => `<div><span class="sp"><span class="strong">${esc(k)}</span><div class="small muted">${b.n} sale${b.n > 1 ? 's' : ''}${b.d ? `, ${money(b.d)} in discounts` : ''}</div></span><span class="strong">${money(b.v)}</span></div>`).join('')}</div>` : emptyBox('users', 'No sales yet', '')}</section>
  <section class="card"><div class="hd"><h2>Payment methods</h2></div>${Object.keys(byPay).length ? `<div class="list">${Object.entries(byPay).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div><span class="sp">${PAY[k] || esc(k)}</span><span class="strong">${money(v)}</span></div>`).join('')}</div>` : emptyBox('cash', 'No payments yet', '')}</section>
  <section class="card"><div class="hd"><h2>Stock value</h2></div><div class="bd"><div class="kpi" style="padding:0;border:0"><div class="v">${money(vals('units').filter(u => u.status === 'in_stock').reduce((a, u) => a + unitCost(u), 0))}</div><div class="k">${vals('units').filter(u => u.status === 'in_stock').length} units in stock, at cost</div></div></div></section></div></div>`;
};

/* ================= audit ================= */
V.audit = () => {
  const q = UI.audQ.trim().toLowerCase(), list = vals('audit').filter(a => !q || [a.action, a.detail, a.by].join(' ').toLowerCase().includes(q)).sort((a, b) => b.t - a.t);
  return `<section class="card"><div class="hd"><input placeholder="Search actions, people or details" value="${esc(UI.audQ)}" onchange="UI.audQ=this.value;render()" style="max-width:340px"><span class="sp"></span><span class="small muted">${list.length} entries</span></div>
  ${list.length ? `<div class="tw"><table><tr><th>When</th><th>Who</th><th>Action</th><th>Detail</th></tr>${list.slice(0, 500).map(a => `<tr><td class="small nowrap">${fmtT(a.t)}</td><td class="small">${esc(a.by)}</td><td class="strong">${esc(a.action)}</td><td class="small">${esc(a.detail)}</td></tr>`).join('')}</table></div>` : emptyBox('doc', 'No activity yet', 'Sales, stock changes, voids, refunds and more are recorded here.')}</section>`;
};

/* ================= settings ================= */
V.settings = () => {
  const s = set_('store'), areas = set_('areas'), riders = set_('riders');
  return `<div class="cols c2"><section class="card"><div class="hd"><h2>Store details</h2></div><div class="bd"><p class="small muted" style="margin-bottom:4px">Shown on receipts and in the online store.</p>
  <div class="fgrid"><div class="full"><label class="f" for="stN">Business name</label><input id="stN" value="${esc(s.name)}"></div><div><label class="f" for="stB">Branch</label><input id="stB" value="${esc(s.branch)}"></div><div><label class="f" for="stA">Address</label><input id="stA" value="${esc(s.address)}"></div><div><label class="f" for="stP">Phone</label><input id="stP" value="${esc(s.phone)}"></div><div><label class="f" for="stW">WhatsApp number</label><input id="stW" value="${esc(s.whatsapp)}" placeholder="e.g. 0244123456"></div><div class="full"><label class="f" for="stE">Email</label><input id="stE" value="${esc(s.email)}"></div><div class="full"><label class="f" for="stH">Opening hours</label><input id="stH" value="${esc(s.hours || '')}" placeholder="e.g. Monday to Saturday, 8:30am to 6:30pm"></div><div class="full"><label class="f" for="stM">Google Maps link (optional)</label><input id="stM" value="${esc(s.map || '')}" placeholder="Paste the Share link from Google Maps"><p class="hint">Used for “Get directions” on the Contact page.</p></div><div class="full"><label class="f" for="stF">Receipt footer</label><textarea id="stF" rows="2">${esc(s.receiptFooter)}</textarea></div></div></div>
  <div class="ft"><button class="btn pri" onclick="act(this,saveStore)">Save details</button></div></section>
  <div><section class="card"><div class="hd"><h2>Delivery areas and fees</h2></div><div class="bd" id="areaRows">${areas.map((a, i) => areaRow(a, i)).join('')}<button class="btn sm" onclick="document.getElementById('areaRows').insertAdjacentHTML('beforeend',areaRow({name:'',fee:''},Date.now()))">${ic('plus', 15)}Add area</button></div><div class="ft"><button class="btn pri" onclick="act(this,saveAreas)">Save areas</button></div></section>
  <section class="card"><div class="hd"><h2>Riders</h2></div>${riders.length ? `<div class="list">${riders.map((r, i) => `<div><span class="sp">${esc(r)}</span><button class="btn ghost sm" onclick="act(this,()=>saveRiders(set_('riders').filter((_,k)=>k!==${i})))" aria-label="Remove">${ic('trash', 15)}</button></div>`).join('')}</div>` : ''}<div class="bd" style="${riders.length ? 'border-top:1px solid var(--line-2)' : ''}"><div class="row"><input id="newRider" placeholder="Rider’s name and phone"><button class="btn" onclick="act(this,()=>{const v=val('newRider').trim();if(!v)throw new Error('Enter a name.');return saveRiders([...set_('riders'),v])})">Add rider</button></div></div></section>
  <section class="card"><div class="hd"><h2>System</h2></div><div class="bd"><dl class="kv"><div><dt>Database</dt><dd>${REMOTE ? 'Connected to Supabase' : 'Not connected. Data is saved on this device only.'}</dd></div><div><dt>Online payments</dt><dd>${CFG.paystackPublicKey ? 'Paystack enabled' : 'Pay on delivery only'}</dd></div></dl><div class="row mt"><button class="btn" onclick="backup()">${ic('download', 16)}Download backup</button></div></div></section></div></div>`;
};
const areaRow = (a, i) => `<div class="row" style="margin-bottom:8px" data-area><input value="${esc(a.name)}" placeholder="Area" aria-label="Area"><input type="number" min="0" value="${esc(a.fee)}" placeholder="Fee" aria-label="Fee in cedis" style="max-width:110px;flex:0 0 110px"><button class="btn ghost sm" onclick="this.parentElement.remove()" aria-label="Remove">${ic('trash', 15)}</button></div>`;
async function saveStore() { const s = { name: val('stN').trim() || 'PriceRight Tech Ltd', branch: val('stB').trim(), address: val('stA').trim(), phone: val('stP').trim(), whatsapp: val('stW').trim(), email: val('stE').trim(), receiptFooter: val('stF').trim(), hours: val('stH').trim(), map: val('stM').trim() }; await tx({ settings: [{ id: 'store', data: s }], audit: [auditRec('Store details updated', '')] }); toast('Store details saved', 'ok') }
async function saveAreas() { const a = [...document.querySelectorAll('[data-area]')].map(r => { const [n, f] = r.querySelectorAll('input'); return { name: n.value.trim(), fee: Number(f.value) || 0 } }).filter(a => a.name); await tx({ settings: [{ id: 'areas', data: a }], audit: [auditRec('Delivery areas updated', a.map(x => `${x.name} ${x.fee}`).join(', '))] }); toast('Delivery areas saved', 'ok'); render() }
async function saveRiders(list) { await tx({ settings: [{ id: 'riders', data: list }], audit: [auditRec('Riders updated', list.join(', '))] }); render() }
function backup() { const d = {}; COLL.forEach(c => d[c] = S[c]); if (can('cost')) d.costs = S.costs; download(`top-league-backup-${ymd()}.json`, JSON.stringify(d, null, 1), 'application/json') }

/* ================= website: categories and SKUs ================= */
V.catalogue = () => {
  const cats = set_('categories') || [], types = set_('sku_types') || [];
  const used = c => vals('products').filter(p => p.cat === c).length, usedT = t => vals('products').filter(p => p.skuType === t).length;
  return `<div class="pagehead"><p class="lede">Categories fill the drop-down when you add a product and group products in the online store. SKU types decide how SKUs are numbered, for example LAP-0001, LAP-0002.</p></div>
  <div class="cols c2"><section class="card"><div class="hd"><h2>Product categories</h2><span class="sp"></span><span class="small muted">${cats.length}</span></div>
  <div class="list" id="catRows">${cats.map((c, i) => `<div><span class="sp">${esc(c)}</span><span class="small muted">${used(c)} product${used(c) === 1 ? '' : 's'}</span><button class="btn ghost sm" onclick="moveCat(${i},-1)" aria-label="Move up" ${i ? '' : 'disabled'}>${ic('back', 14)}</button><button class="btn ghost sm" onclick="act(this,()=>removeCat(${i}))" aria-label="Remove ${esc(c)}">${ic('trash', 15)}</button></div>`).join('') || `<div class="muted">No categories yet.</div>`}</div>
  <div class="bd" style="border-top:1px solid var(--line-2)"><div class="row"><input id="newCat" placeholder="New category, e.g. Wardrobes" onkeydown="if(event.key==='Enter')act(null,addCat)"><button class="btn pri" onclick="act(this,addCat)">${ic('plus', 15)}Add</button></div></div></section>
  <section class="card"><div class="hd"><h2>SKU types</h2><span class="sp"></span><span class="small muted">${types.length}</span></div>
  ${types.length ? `<div class="tw"><table><tr><th>Type</th><th>Prefix</th><th>Next SKU</th><th class="num">Products</th><th></th></tr>${types.map((t, i) => `<tr><td class="strong">${esc(t.name)}</td><td class="mono">${esc(t.prefix)}</td><td class="mono">${esc(nextSku(t.prefix))}</td><td class="num">${usedT(t.prefix)}</td><td class="num"><button class="btn ghost sm" onclick="act(this,()=>removeSkuType(${i}))" aria-label="Remove ${esc(t.name)}">${ic('trash', 15)}</button></td></tr>`).join('')}</table></div>` : `<div class="bd muted">No SKU types yet.</div>`}
  <div class="bd" style="border-top:1px solid var(--line-2)"><div class="fgrid"><div><label class="f" for="ntN" style="margin-top:0">Type name</label><input id="ntN" placeholder="e.g. Wardrobes" oninput="const p=$('#ntP');if(!p.dataset.touched)p.value=this.value.replace(/[^A-Za-z]/g,'').slice(0,3).toUpperCase()"></div><div><label class="f" for="ntP" style="margin-top:0">Prefix</label><input id="ntP" class="mono" maxlength="6" placeholder="WRD" oninput="this.dataset.touched=1;this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')"></div></div>
  <button class="btn pri" style="margin-top:12px" onclick="act(this,addSkuType)">${ic('plus', 15)}Add SKU type</button></div></section></div>`;
};
async function saveSetting(key, data, what) { await tx({ settings: [{ id: key, data }], audit: [auditRec(what, '')] }); render() }
async function addCat() { const v = val('newCat').trim(); if (!v) throw new Error('Type a category name.'); const c = set_('categories') || []; if (c.some(x => x.toLowerCase() === v.toLowerCase())) throw new Error('That category already exists.'); await saveSetting('categories', [...c, v], 'Category added: ' + v); toast('Category added', 'ok') }
async function removeCat(i) { const c = [...set_('categories')], n = vals('products').filter(p => p.cat === c[i]).length; if (n && !confirm(`${n} product(s) use “${c[i]}”. They keep it, but it won’t be offered for new products. Remove it?`)) return; const [x] = c.splice(i, 1); await saveSetting('categories', c, 'Category removed: ' + x) }
function moveCat(i, d) { const c = [...set_('categories')]; [c[i + d], c[i]] = [c[i], c[i + d]]; act(null, () => saveSetting('categories', c, 'Categories reordered')) }
async function addSkuType() {
  const name = val('ntN').trim(), prefix = val('ntP').trim().toUpperCase(), t = set_('sku_types') || [];
  if (!name) throw new Error('Type a name for the SKU type.'); if (!/^[A-Z0-9]{2,6}$/.test(prefix)) throw new Error('Use a prefix of 2 to 6 letters or numbers.');
  if (t.some(x => x.prefix === prefix)) throw new Error(`The prefix ${prefix} is already used.`);
  await saveSetting('sku_types', [...t, { name, prefix }], `SKU type added: ${name} (${prefix})`); toast('SKU type added', 'ok');
}
async function removeSkuType(i) { const t = [...set_('sku_types')]; if (!confirm(`Remove the SKU type ${t[i].name}? Existing SKUs stay as they are.`)) return; const [x] = t.splice(i, 1); await saveSetting('sku_types', t, 'SKU type removed: ' + x.name) }

/* ================= website: banners ================= */
const LINKS = () => [['#/shop', 'All products'], ...catList().map(c => ['#/shop?cat=' + encodeURIComponent(c), c]), ['#/blog', 'Blog'], ['#/contact', 'Contact'], ['#/track', 'Track an order']];
V.banners = () => {
  const B = UI.ban = UI.ban || JSON.parse(JSON.stringify(set_('banners') || []));
  return `<div class="pagehead"><p class="lede">The slides at the top of the online store. Use wide photos, about 1600 by 640 pixels. Slides change every few seconds.</p><span class="sp"></span><button class="btn" onclick="UI.ban.push({img:'',title:'',text:'',btn:'Shop now',link:'#/shop',on:true});render()">${ic('plus', 16)}Add slide</button><button class="btn pri" onclick="act(this,saveBanners)">Save banners</button></div>
  ${B.length ? B.map((b, i) => `<section class="card banedit"><div class="bd"><div class="banprev" style="${b.img ? `background-image:url('${esc(b.img)}')` : ''}">${b.img ? '' : `<span>${ic('image', 28)}<br>No photo yet</span>`}<label class="btn sm">${ic('camera', 15)}${b.img ? 'Change photo' : 'Add photo'}<input type="file" accept="image/*" hidden onchange="act(null,()=>bannerImg(${i},this))"></label></div>
  <div class="fgrid"><div class="full"><label class="f" style="margin-top:0">Headline</label><input value="${esc(b.title)}" oninput="UI.ban[${i}].title=this.value" placeholder="e.g. Back-to-school laptops"></div>
  <div class="full"><label class="f">Short line under the headline</label><input value="${esc(b.text)}" oninput="UI.ban[${i}].text=this.value" placeholder="e.g. Core i5 and i7 machines with a 12-month warranty"></div>
  <div><label class="f">Button text</label><input value="${esc(b.btn)}" oninput="UI.ban[${i}].btn=this.value"></div>
  <div><label class="f">Button opens</label><select onchange="UI.ban[${i}].link=this.value">${LINKS().map(([v, l]) => `<option value="${esc(v)}" ${v === b.link ? 'selected' : ''}>${esc(l)}</option>`).join('')}${LINKS().some(l => l[0] === b.link) ? '' : `<option selected value="${esc(b.link)}">${esc(b.link)}</option>`}</select></div></div>
  <div class="row mt"><label class="chk" style="margin:0"><input type="checkbox" ${b.on !== false ? 'checked' : ''} onchange="UI.ban[${i}].on=this.checked"><span>Show this slide</span></label><span class="sp"></span><button class="btn ghost sm" ${i ? '' : 'disabled'} onclick="const a=UI.ban;[a[${i - 1}],a[${i}]]=[a[${i}],a[${i - 1}]];render()">Move up</button><button class="btn ghost sm" onclick="UI.ban.splice(${i},1);render()">${ic('trash', 15)}Remove</button></div></div></section>`).join('')
    : `<section class="card">${emptyBox('image', 'No banners yet', 'Until you add one, the store shows a simple welcome slide.', `<button class="btn pri" onclick="UI.ban.push({img:'',title:'',text:'',btn:'Shop now',link:'#/shop',on:true});render()">${ic('plus', 16)}Add slide</button>`)}</section>`}`;
};
async function bannerImg(i, inp) { const f = inp.files[0]; if (!f) return; toast('Uploading photo…'); UI.ban[i].img = await uploadImage(f, 'product-images', 1800); render() }
async function saveBanners() { const b = UI.ban.filter(x => x.title.trim() || x.img); await saveSetting('banners', b, `Banners updated (${b.length})`); UI.ban = null; toast('Banners saved', 'ok') }

/* ================= website: blog ================= */
V.blog = () => {
  const pub = (set_('blog') || []).map(p => ({ ...p, live: true })), dr = (set_('blog_drafts') || []).map(p => ({ ...p, live: false }));
  const all = [...dr, ...pub].sort((a, b) => b.t - a.t);
  return `<div class="pagehead"><p class="lede">Tech news, buying guides and shop updates. Published posts appear on the store’s Blog page and home page.</p><span class="sp"></span><button class="btn pri" onclick="editPost()">${ic('plus', 16)}New post</button></div>
  <section class="card">${all.length ? `<div class="list">${all.map(p => `<div class="click" style="cursor:pointer" onclick="editPost('${p.id}')"><div class="thumb" style="width:72px;height:48px">${p.cover ? `<img src="${esc(p.cover)}" alt="">` : ic('doc', 20)}</div><span class="sp"><span class="strong">${esc(p.title)}</span><div class="small muted">${fmtD(p.t)}${p.tag ? ', ' + esc(p.tag) : ''}</div></span>${p.live ? st('Published', 'g') : st('Draft', 'm')}</div>`).join('')}</div>` : emptyBox('doc', 'No posts yet', 'Write about new arrivals, buying tips or tech news.', `<button class="btn pri" onclick="editPost()">${ic('plus', 16)}New post</button>`)}</section>`;
};
const findPost = id => [...(set_('blog') || []).map(p => ({ ...p, live: true })), ...(set_('blog_drafts') || []).map(p => ({ ...p, live: false }))].find(p => p.id === id);
function editPost(id) {
  const p = id ? findPost(id) : { id: '', title: '', tag: 'Tech news', excerpt: '', body: '', cover: '', live: false, t: Date.now() };
  UI.postImg = p.cover || '';
  modal(id ? 'Edit post' : 'New post', `<label class="f" for="bpT" style="margin-top:0">Title</label><input id="bpT" value="${esc(p.title)}" autofocus>
  <div class="fgrid"><div><label class="f" for="bpG">Topic</label><input id="bpG" list="bpTags" value="${esc(p.tag || '')}"><datalist id="bpTags"><option value="Tech news"><option value="Buying guide"><option value="How to"><option value="Shop news"><option value="Security tips"></datalist></div>
  <div><label class="f">Cover photo</label><div class="row"><div class="thumb" id="bpPrev" style="width:72px;height:48px">${p.cover ? `<img src="${esc(p.cover)}" alt="">` : ic('image', 18)}</div><input type="file" accept="image/*" style="flex:1" onchange="act(null,()=>postImg(this))"></div></div></div>
  <label class="f" for="bpX">Summary</label><textarea id="bpX" rows="2" placeholder="One or two sentences shown on the blog list">${esc(p.excerpt || '')}</textarea>
  <label class="f" for="bpB">Post</label><textarea id="bpB" rows="12" placeholder="Write the post. Leave a blank line between paragraphs.&#10;## A line starting with ## becomes a heading&#10;- Lines starting with - become a list&#10;**Bold text** between double stars">${esc(p.body || '')}</textarea>
  <label class="chk"><input id="bpL" type="checkbox" ${p.live ? 'checked' : ''}><span>Published on the store</span></label>`,
    `${id ? `<button class="btn danger" onclick="act(this,()=>deletePost('${id}'))">Delete</button>` : ''}<button class="btn" onclick="closeModal()">Cancel</button><button class="btn pri" onclick="act(this,()=>savePost('${id || ''}'))">${id ? 'Save post' : 'Save post'}</button>`, { wide: true });
}
async function postImg(inp) { const f = inp.files[0]; if (!f) return; $('#bpPrev').innerHTML = '<span class="spin"></span>'; UI.postImg = await uploadImage(f, 'product-images', 1600); $('#bpPrev').innerHTML = `<img src="${esc(UI.postImg)}" alt="">` }
async function savePost(id) {
  const title = val('bpT').trim(), body = val('bpB').trim(); if (!title) throw new Error('Add a title.'); if (body.length < 20) throw new Error('Write the post before saving.');
  const old = id ? findPost(id) : null, live = $('#bpL').checked;
  const post = { id: id || slug(title) + '-' + rnd(4).toLowerCase(), title, tag: val('bpG').trim(), excerpt: val('bpX').trim() || body.replace(/[#*\-]/g, '').slice(0, 180), body, cover: UI.postImg || '', t: old ? old.t : Date.now(), by: meName() };
  const pub = (set_('blog') || []).filter(p => p.id !== post.id), dr = (set_('blog_drafts') || []).filter(p => p.id !== post.id);
  if (live) pub.unshift(post); else dr.unshift(post);
  await tx({ settings: [{ id: 'blog', data: pub.sort((a, b) => b.t - a.t) }, { id: 'blog_drafts', data: dr }], audit: [auditRec(live ? 'Blog post published' : 'Blog draft saved', title)] });
  closeModal(); toast(live ? 'Post published' : 'Draft saved', 'ok'); render();
}
async function deletePost(id) { if (!confirm('Delete this post?')) return; await tx({ settings: [{ id: 'blog', data: (set_('blog') || []).filter(p => p.id !== id) }, { id: 'blog_drafts', data: (set_('blog_drafts') || []).filter(p => p.id !== id) }], audit: [auditRec('Blog post deleted', id)] }); closeModal(); render() }
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'post';

/* ================= website: messages ================= */
V.messages = () => {
  if (!REMOTE) S.messages = ls.get('tle-messages', {});
  const tab = UI.msgTab || 'new', all = Object.values(S.messages || {}).sort((a, b) => b.t - a.t), list = all.filter(m => (m.status || 'new') === tab);
  return `<div class="pagehead"><p class="lede">Messages sent from the Contact page of the online store.</p></div>
  <div class="seg" style="margin-bottom:14px"><button class="${tab === 'new' ? 'on' : ''}" onclick="UI.msgTab='new';render()">To answer (${all.filter(m => (m.status || 'new') === 'new').length})</button><button class="${tab === 'done' ? 'on' : ''}" onclick="UI.msgTab='done';render()">Answered</button></div>
  ${list.length ? list.map(m => { const ph = normPhone(m.phone); return `<section class="card"><div class="hd"><div><span class="strong">${esc(m.name)}</span><div class="small muted">${fmtT(m.t)}, ${esc(m.topic || 'General')}</div></div><span class="sp"></span>${tab === 'new' ? st('New', 'b') : st('Answered', 'g')}</div><div class="bd"><p style="white-space:pre-wrap">${esc(m.message)}</p>
  <div class="row mt">${ph.length >= 9 ? `<a class="btn sm" href="tel:${esc(m.phone)}">${ic('phone', 14)}${esc(m.phone)}</a><a class="btn sm" target="_blank" rel="noopener" href="https://wa.me/233${ph.slice(1)}">${ic('msg', 14)}WhatsApp</a>` : ''}${m.email ? `<a class="btn sm" href="mailto:${esc(m.email)}?subject=${encodeURIComponent('Re: your message to ' + set_('store').name)}">${ic('mail', 14)}${esc(m.email)}</a>` : ''}<span class="sp"></span><button class="btn ${tab === 'new' ? 'pri' : ''} sm" onclick="act(this,()=>msgStatus('${esc(m.id)}','${tab === 'new' ? 'done' : 'new'}'))">${tab === 'new' ? `${ic('check', 14)}Mark answered` : 'Move back to answer'}</button></div></div></section>` }).join('')
    : `<section class="card">${emptyBox('mail', tab === 'new' ? 'Nothing to answer' : 'No answered messages', tab === 'new' ? 'New messages from the store’s Contact page appear here.' : 'Messages you mark as answered move here.')}</section>`}`;
};
async function msgStatus(id, s) {
  if (REMOTE) { const { error } = await sb.rpc('message_status', { k: id, s }); if (error) throw new Error(friendlyErr(error.message)) }
  else { const all = ls.get('tle-messages', {}); all[id].status = s; ls.set('tle-messages', all) }
  S.messages[id] = { ...S.messages[id], status: s }; render();
}

/* ================= staff accounts ================= */
V.staff = () => {
  const list = Object.values(S.staff).sort((a, b) => a.email.localeCompare(b.email));
  return `<div class="pagehead"><p class="lede">${can('staffEdit') ? 'Add staff and choose what they can do.' : 'Only the IT admin can change staff accounts.'} ${REMOTE ? 'New staff set their own password using “First time? Set your password” on the sign-in page.' : ''}</p><span class="sp"></span>${can('staffEdit') ? `<button class="btn pri" onclick="editStaff()">${ic('userplus', 16)}Add staff</button>` : ''}</div>
  <section class="card"><div class="tw"><table><tr><th>Name</th><th>Email</th><th>Role</th><th>Can</th>${can('staffEdit') ? '<th></th>' : ''}</tr>${list.map(s => `<tr><td><div class="pcell"><span class="av" style="background:var(--blue-t);color:var(--navy)">${esc(initials(s.name || s.email))}</span><span class="strong">${esc(s.name || '')}</span></div></td><td>${esc(s.email)}${s.email === ME.email ? ' <span class="small muted">(you)</span>' : ''}</td><td>${esc(ROLE_NAME[s.role])}</td><td class="small muted">${{ attendant: 'Sell, receive stock, log returns, pack orders', owner: 'Everything, including prices, voids, refunds and return decisions', it_admin: 'Everything except voids and return decisions, plus staff accounts' }[s.role]}</td>${can('staffEdit') ? `<td class="num"><button class="btn sm" onclick="editStaff('${esc(s.email)}')">${ic('edit', 14)}Edit</button></td>` : ''}</tr>`).join('')}</table></div></section>`;
};
function editStaff(email) {
  const s = email ? S.staff[email] : { email: '', name: '', role: 'attendant' };
  modal(email ? 'Edit staff account' : 'Add staff', `<label class="f" for="sfN" style="margin-top:0">Name</label><input id="sfN" value="${esc(s.name || '')}" autofocus><label class="f" for="sfE">Email</label><input id="sfE" type="email" value="${esc(s.email)}" ${email ? 'disabled' : ''}>
  <label class="f" for="sfR">Role</label><select id="sfR">${Object.entries(ROLE_NAME).map(([k, v]) => `<option value="${k}" ${s.role === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
  ${!REMOTE ? `<label class="f" for="sfP">${email ? 'New password (leave blank to keep)' : 'Password'}</label><input id="sfP" type="text" autocomplete="off"><p class="hint">At least 8 characters. Share it with them privately.</p>` : `${email ? `<div class="row mt"><button class="btn sm" onclick="act(this,async()=>{const {error}=await sb.auth.resetPasswordForEmail('${esc(s.email)}',{redirectTo:location.origin+'/staff'});if(error)throw error;toast('Password reset email sent','ok')})">${ic('mail', 14)}Send password reset email</button></div>` : ''}`}`,
    `${email && email !== ME.email ? `<button class="btn danger" onclick="act(this,()=>removeStaff('${esc(email)}'))">Remove access</button>` : ''}<button class="btn" onclick="closeModal()">Cancel</button><button class="btn pri" onclick="act(this,()=>saveStaff('${esc(email || '')}'))">${email ? 'Save' : 'Add staff'}</button>`);
}
async function saveStaff(email) {
  const e = (email || val('sfE')).trim().toLowerCase(), name = val('sfN').trim(), role = val('sfR');
  if (!/^\S+@\S+\.\S+$/.test(e)) throw new Error('Enter a valid email.'); if (!email && S.staff[e]) throw new Error('This email already has an account.');
  if (email === ME.email && role !== 'it_admin') throw new Error('You can’t remove your own IT admin role.');
  const rec = { email: e, name, role };
  if (!REMOTE) { const pw = val('sfP'); if (!email && pw.length < 8) throw new Error('Set a password of at least 8 characters.'); if (pw) { if (pw.length < 8) throw new Error('Use at least 8 characters.'); rec.hash = await sha(e + ':' + pw) } }
  await tx({ staff_roles: [rec], audit: [auditRec(email ? 'Staff account updated' : 'Staff account added', `${e}: ${ROLE_NAME[role]}`)] });
  closeModal(); toast(email ? 'Saved' : 'Staff added', 'ok'); render();
}
async function removeStaff(email) { if (!confirm(`Remove ${email}’s access?`)) return; await tx({ staff_roles: [{ email, removed: true }], audit: [auditRec('Staff access removed', email)] }); closeModal(); toast('Access removed'); render() }

/* ================= public store ================= */
const cartGet = () => ls.get('tle-cart', []), cartSet = c => { ls.set('tle-cart', c); renderCartBadge() };
const cartCount = () => cartGet().reduce((a, i) => a + i.qty, 0);
function renderCartBadge() { document.querySelectorAll('.cartN').forEach(b => { const n = cartCount(); b.textContent = n; b.classList.toggle('hide', !n); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump') }) }
const SV = {};
const shopProducts = () => vals('products').filter(p => p.active !== false);
const av = id => (UI.avail || {})[id] ?? 0;
const storeCats = () => { const used = new Set(shopProducts().map(p => p.cat)); const listed = (set_('categories') || []).filter(c => used.has(c)); return [...listed, ...[...used].filter(c => !listed.includes(c))] };
const waLink = (text = '') => { const w = normPhone(set_('store').whatsapp); return w.length >= 9 ? `https://wa.me/233${w.slice(1)}${text ? '?text=' + encodeURIComponent(text) : ''}` : '' };
const closeDrawer = () => { const d = $('#drawer'); if (d) d.classList.remove('open') };
const tag = (p, big) => `<span class="ptag${big ? ' big' : ''}">${money(p.price)}</span>${p.was > p.price ? `<s class="was">${money(p.was)}</s>` : ''}`;
// Small, safe formatting for blog posts: ## headings, - lists, **bold**, blank-line paragraphs.
function md(t) {
  const out = []; let list = null;
  const inl = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  String(t || '').split(/\n/).forEach(l => {
    const x = l.trim();
    if (/^[-*] /.test(x)) { (list = list || []).push(`<li>${inl(x.slice(2))}</li>`); return }
    if (list) { out.push(`<ul>${list.join('')}</ul>`); list = null }
    if (!x) return;
    if (x.startsWith('## ')) out.push(`<h2>${inl(x.slice(3))}</h2>`); else if (x.startsWith('# ')) out.push(`<h2>${inl(x.slice(2))}</h2>`); else out.push(`<p>${inl(x)}</p>`);
  });
  if (list) out.push(`<ul>${list.join('')}</ul>`);
  return out.join('');
}

function renderStore() {
  const r = route(), page = r.parts[0] || '';
  const views = { '': SV.home, shop: SV.shop, p: SV.product, cart: SV.cart, done: SV.done, track: SV.track, returns: SV.returns, warranty: SV.warranty, blog: SV.blog, contact: SV.contact, privacy: SV.legal, terms: SV.legal, policies: SV.legal };
  clearInterval(UI.carT);
  const body = (views[page] || SV.home)(r);
  const store = set_('store'), cats = storeCats(), wa = waLink();
  const titles = { shop: 'Shop', cart: 'Your cart', track: 'Track an order', returns: 'Returns', warranty: 'Warranty check', blog: 'Blog', contact: 'Contact us', privacy: 'Privacy policy', terms: 'Terms of sale', policies: 'Returns and warranty policy' };
  const post = page === 'blog' && r.parts[1] ? (set_('blog') || []).find(x => x.id === r.parts[1]) : null;
  document.title = (page === 'p' && prod(r.parts[1]) ? prod(r.parts[1]).name + ' | ' : post ? post.title + ' | ' : titles[page] ? titles[page] + ' | ' : '') + store.name;
  const curCat = page === 'shop' ? r.q.get('cat') || '' : '';
  const q = page === 'shop' ? r.q.get('q') || '' : '';
  $('#app').innerHTML = `<div class="utility"><div class="in"><span>${ic('truck', 15)}Delivery across Accra by our own riders</span><span class="sp"></span>${store.phone ? `<a href="tel:${esc(store.phone)}">${ic('phone', 14)}${esc(store.phone)}</a>` : ''}<a href="#/track">Track an order</a><a href="#/contact">Help</a></div></div>
  <header class="shead"><div class="in"><button class="drawer-btn" onclick="$('#drawer').classList.add('open')" aria-label="Open menu">${ic('menu', 22)}</button>
  <a href="#/" class="lockup" aria-label="${esc(store.name)} home"><span class="mk ring"></span><span class="wm">PriceRight<span>Tech Ltd</span></span></a>
  <form class="ssearch" role="search" onsubmit="event.preventDefault();go('shop?q='+encodeURIComponent(this.q.value.trim()))">${ic('search', 18)}<input name="q" placeholder="Search laptops, phones, cameras…" value="${esc(q)}" aria-label="Search products"><button class="btn pri">Search</button></form>
  <nav class="hact"><a href="#/contact" class="hlink">${ic('msg', 20)}<span>Contact</span></a><a href="#/cart" class="hlink cart" aria-label="Cart">${ic('cart', 21)}<span>Cart</span><b class="cartN ${cartCount() ? '' : 'hide'}">${cartCount()}</b></a></nav></div>
  <nav class="catbar" aria-label="Categories"><div class="in"><a href="#/shop" class="${page === 'shop' && !curCat && !q ? 'act' : ''}">All products</a>${cats.map(c => `<a href="#/shop?cat=${encodeURIComponent(c)}" class="${curCat === c ? 'act' : ''}">${esc(c)}</a>`).join('')}<a href="#/blog" class="${page === 'blog' ? 'act' : ''}">Blog</a></div></nav></header>
  <div class="drawer" id="drawer"><div class="scr" onclick="closeDrawer()"></div><div class="pane"><div class="row between" style="margin-bottom:10px"><span class="lockup"><span class="mk"></span><span class="wm">PriceRight<span>Tech Ltd</span></span></span><button class="btn ghost sm" onclick="closeDrawer()" aria-label="Close menu">${ic('x', 18)}</button></div>
  <a href="#/" onclick="closeDrawer()">Home</a><a href="#/shop" onclick="closeDrawer()">All products</a>${cats.map(c => `<a class="sub" href="#/shop?cat=${encodeURIComponent(c)}" onclick="closeDrawer()">${esc(c)}</a>`).join('')}<a href="#/blog" onclick="closeDrawer()">Blog</a><a href="#/track" onclick="closeDrawer()">Track an order</a><a href="#/returns" onclick="closeDrawer()">Returns</a><a href="#/warranty" onclick="closeDrawer()">Warranty check</a><a href="#/contact" onclick="closeDrawer()">Contact us</a>${canInstall() ? `<a href="#" onclick="event.preventDefault();installApp()">Install the app</a>` : ''}</div></div>
  <main class="store" id="main">${body}</main>
  <footer class="sfoot"><div class="in"><div class="fbrand"><span class="lockup"><span class="mk"></span><span class="wm">PriceRight<span>Tech Ltd</span></span></span><p>Laptops, phones, CCTV, storage and accessories, sold with a warranty and delivered across Accra.</p>${wa ? `<a class="btn gold" href="${wa}" target="_blank" rel="noopener">${ic('msg', 16)}Chat on WhatsApp</a>` : ''}</div>
  <div><h4>Shop</h4><a href="#/shop">All products</a>${cats.slice(0, 6).map(c => `<a href="#/shop?cat=${encodeURIComponent(c)}">${esc(c)}</a>`).join('')}</div>
  <div><h4>Help</h4><a href="#/track">Track an order</a><a href="#/returns">Return an item</a><a href="#/warranty">Check a warranty</a><a href="#/contact">Contact us</a>${canInstall() ? `<button class="lnk" onclick="installApp()">Install the app</button>` : ''}</div>
  <div><h4>Company</h4><a href="#/blog">Blog</a><a href="#/policies">Returns and warranty policy</a><a href="#/terms">Terms of sale</a><a href="#/privacy">Privacy policy</a></div>
  <div><h4>Visit or call</h4>${store.address ? `<span class="fl">${esc(store.address)}</span>` : ''}${store.hours ? `<span class="fl">${esc(store.hours)}</span>` : ''}${store.phone ? `<a href="tel:${esc(store.phone)}">${esc(store.phone)}</a>` : ''}${store.email ? `<a href="mailto:${esc(store.email)}">${esc(store.email)}</a>` : ''}</div></div>
  <div class="base"><span>© ${new Date().getFullYear()} ${esc(store.name)}. All rights reserved.</span><span><a href="#/privacy">Privacy</a><a href="#/terms">Terms</a><a href="/staff">Staff sign in</a></span></div></footer>`;
  if (page === '' && !r.q.get('q')) startCarousel();
  if (r.q.get('q') && page === '') go('shop?q=' + encodeURIComponent(r.q.get('q')));
}

/* product card, used everywhere */
function pcard(p) {
  const a = av(p.id), off = p.was > p.price ? Math.round((1 - p.price / p.was) * 100) : 0;
  return `<article class="pcard${a ? '' : ' out'}"><a class="pic" href="#/p/${p.id}" aria-label="${esc(p.name)}">${pic(p, 150, 100)}${off ? `<span class="off">${off}% off</span>` : ''}${!a ? `<span class="soldout">Out of stock</span>` : a <= 3 ? `<span class="few">Only ${a} left</span>` : ''}</a>
  <div class="meta"><span class="brandn">${esc(p.brand || p.cat)}</span><a class="nm" href="#/p/${p.id}">${esc(p.name)}</a><span class="wr">${ic('shield', 14)}${p.w ?? 12}-month warranty</span>
  <div class="buy"><div class="prices">${tag(p)}</div>${a ? `<button class="qadd" onclick="addToCart('${p.id}',1,this)" aria-label="Add ${esc(p.name)} to cart">${ic('cart', 18)}<span>Add</span></button>` : ''}</div></div></article>`;
}

/* ---------- home ---------- */
function slides() {
  const b = (set_('banners') || []).filter(x => x.on !== false && (x.title || x.img));
  if (b.length) return b;
  const n = set_('store').name;
  return [{ title: 'Tech at the right price.', text: `Laptops, phones, CCTV and accessories from ${n}, delivered across Accra.`, btn: 'Shop all products', link: '#/shop', art: 'Laptops' },
  { title: 'See everything, from anywhere.', text: 'CCTV cameras, recorders and storage for your home or shop.', btn: 'Shop CCTV', link: '#/shop?cat=' + encodeURIComponent(storeCats().find(c => /cctv|secur/i.test(c)) || 'CCTV & Security'), art: 'CCTV & Security' }];
}
SV.home = () => {
  const S2 = slides(), all = shopProducts(), cats = storeCats(), posts = (set_('blog') || []).slice(0, 3), wa = waLink('Hello, I need help choosing a device.');
  const inStock = all.filter(p => av(p.id) > 0);
  let feat = all.filter(p => p.featured && av(p.id) > 0); if (feat.length < 4) feat = [...feat, ...inStock.filter(p => !p.featured).sort((a, b) => (b.updated || 0) - (a.updated || 0))].slice(0, 8);
  const deals = inStock.filter(p => p.was > p.price).slice(0, 4);
  UI.car = Math.min(UI.car || 0, S2.length - 1);
  return `<section class="carousel" aria-roledescription="carousel" aria-label="Highlights" onmouseenter="UI.carHold=1" onmouseleave="UI.carHold=0">
  <div class="track" id="carTrack" style="transform:translateX(-${UI.car * 100}%)">${S2.map((s, i) => `<div class="slide${s.img ? ' photo' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${S2.length}" ${s.img ? `style="background-image:url('${esc(s.img)}')"` : ''}>
  <div class="copy"><h2>${esc(s.title)}</h2>${s.text ? `<p>${esc(s.text)}</p>` : ''}${s.btn ? `<a class="btn gold lg" href="${esc(s.link || '#/shop')}">${esc(s.btn)}</a>` : ''}</div>
  ${s.img ? '' : slideArt(s)}</div>`).join('')}</div>
  ${S2.length > 1 ? `<button class="carbtn prev" onclick="carGo(-1)" aria-label="Previous slide">${ic('back', 22)}</button><button class="carbtn next" onclick="carGo(1)" aria-label="Next slide">${ic('chev', 22)}</button><div class="dots">${S2.map((_, i) => `<button class="${i === UI.car ? 'on' : ''}" onclick="carTo(${i})" aria-label="Slide ${i + 1}"></button>`).join('')}</div>` : ''}</section>
  ${cats.length ? `<section class="sec"><div class="sechd"><h2>Shop by category</h2><a href="#/shop">All products${ic('chev', 16)}</a></div><div class="cattiles">${cats.map(c => { const n = all.filter(p => p.cat === c).length; return `<a href="#/shop?cat=${encodeURIComponent(c)}" class="ctile"><span class="cart2">${art({ cat: c }, 96, 64)}</span><b>${esc(c)}</b><span>${n} product${n === 1 ? '' : 's'}</span></a>` }).join('')}</div></section>` : ''}
  <section class="assure"><div>${ic('shield', 22)}<span><b>Warranty on every device</b>Written on your receipt</span></div><div>${ic('truck', 22)}<span><b>Delivery across Accra</b>Fee shown at checkout</span></div><div>${ic('cash', 22)}<span><b>Pay on delivery</b>Cash or mobile money${CFG.paystackPublicKey ? ', or pay online' : ''}</span></div><div>${ic('msg', 22)}<span><b>Real people to help</b>Call or WhatsApp the shop</span></div></section>
  ${feat.length ? `<section class="sec"><div class="sechd"><h2>${all.some(p => p.featured) ? 'Featured' : 'In stock now'}</h2><a href="#/shop">See all${ic('chev', 16)}</a></div><div class="pgrid">${feat.map(pcard).join('')}</div></section>` : `<section class="sec"><div class="card">${emptyBox('box', 'Products are on the way', 'Our online catalogue is being set up. Call or WhatsApp the shop in the meantime.', wa ? `<a class="btn pri" href="${wa}" target="_blank" rel="noopener">Chat on WhatsApp</a>` : '')}</div></section>`}
  ${deals.length ? `<section class="sec deals"><div class="sechd"><h2>Price drops</h2><a href="#/shop?sort=deals">See all deals${ic('chev', 16)}</a></div><div class="pgrid">${deals.map(pcard).join('')}</div></section>` : ''}
  <section class="sec how"><div class="sechd"><h2>How buying works</h2></div><ol class="howsteps"><li><b>Pick your device</b><span>Add it to your cart. No account needed.</span></li><li><b>Check out</b><span>Give your name, phone and delivery area. The delivery fee shows straight away.</span></li><li><b>We call to confirm</b><span>We check the details with you and pack your order.</span></li><li><b>Delivered to you</b><span>Our rider brings it. Pay on delivery${CFG.paystackPublicKey ? ' or pay online at checkout' : ' with cash or MoMo'}.</span></li></ol></section>
  ${posts.length ? `<section class="sec"><div class="sechd"><h2>From the blog</h2><a href="#/blog">All posts${ic('chev', 16)}</a></div><div class="bgrid">${posts.map(bcard).join('')}</div></section>` : ''}
  <section class="helpband"><div><h2>Not sure what to buy?</h2><p>Tell us what you need it for and your budget. We’ll suggest the right device.</p></div><div class="row">${wa ? `<a class="btn gold lg" href="${wa}" target="_blank" rel="noopener">${ic('msg', 18)}WhatsApp us</a>` : ''}<a class="btn lg onnavy" href="#/contact">Contact us</a></div></section>`;
};
function slideArt(s) {
  const c = s.art || new URLSearchParams(String(s.link || '').split('?')[1] || '').get('cat') || '';
  const k = c ? artKey(c) : '';
  return `<div class="slideart" aria-hidden="true"><div class="disc">${k && k !== 'Other' ? art({ cat: c }, 300, 200) : '<span class="bigmark"></span>'}</div>${k && fromPrice(c) ? `<span class="ptag big">From ${money(fromPrice(c))}</span>` : ''}</div>`;
}
function carTo(i) { const n = slides().length; UI.car = (i + n) % n; const t = $('#carTrack'); if (!t) return; t.style.transform = `translateX(-${UI.car * 100}%)`; document.querySelectorAll('.carousel .dots button').forEach((b, k) => b.classList.toggle('on', k === UI.car)) }
function carGo(d) { carTo((UI.car || 0) + d); startCarousel() }
function startCarousel() {
  clearInterval(UI.carT); if (slides().length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  UI.carT = setInterval(() => { if (!UI.carHold && !document.hidden) carTo((UI.car || 0) + 1) }, 6000);
  const el = $('.carousel'); if (!el) return; let x0 = null;
  el.addEventListener('pointerdown', e => { x0 = e.clientX }, { passive: true });
  el.addEventListener('pointerup', e => { if (x0 != null && Math.abs(e.clientX - x0) > 40) carGo(e.clientX < x0 ? 1 : -1); x0 = null }, { passive: true });
}

/* ---------- shop / search ---------- */
SV.shop = r => {
  const q = (r.q.get('q') || '').trim(), cat = r.q.get('cat') || '', sort = r.q.get('sort') || UI.ssort || 'feat', only = !!UI.sOnly;
  const all = shopProducts(), cats = storeCats(), ql = q.toLowerCase();
  let list = all.filter(p => (!cat || p.cat === cat) && (!ql || [p.name, p.brand, p.cat, p.sku, p.desc].join(' ').toLowerCase().includes(ql)) && (!only || av(p.id) > 0) && (sort !== 'deals' || p.was > p.price));
  const brands = [...new Set(list.map(p => p.brand).filter(Boolean))].sort(), brand = UI.sBrand && brands.includes(UI.sBrand) ? UI.sBrand : '';
  if (brand) list = list.filter(p => p.brand === brand);
  list.sort(sort === 'lo' ? (a, b) => a.price - b.price : sort === 'hi' ? (a, b) => b.price - a.price : sort === 'new' ? (a, b) => (b.updated || 0) - (a.updated || 0) : (a, b) => (av(b.id) > 0) - (av(a.id) > 0) || !!b.featured - !!a.featured || a.name.localeCompare(b.name));
  const link = (k, v) => { const u = new URLSearchParams(r.q); v ? u.set(k, v) : u.delete(k); const s2 = u.toString(); return '#/shop' + (s2 ? '?' + s2 : '') };
  return `<div class="crumbs"><a href="#/">Home</a>${ic('chev', 14)}<span>${q ? 'Search' : cat ? esc(cat) : 'All products'}</span></div>
  <div class="shophd"><h1>${q ? `Results for “${esc(q)}”` : cat ? esc(cat) : 'All products'}</h1><span class="muted">${list.length} product${list.length === 1 ? '' : 's'}</span></div>
  <div class="shop"><aside class="filters"><h3>Category</h3><a href="${link('cat', '')}" class="${cat ? '' : 'on'}">All</a>${cats.map(c => `<a href="${link('cat', c)}" class="${cat === c ? 'on' : ''}">${esc(c)}<span>${all.filter(p => p.cat === c).length}</span></a>`).join('')}
  ${brands.length > 1 ? `<h3>Brand</h3><a href="#" class="${brand ? '' : 'on'}" onclick="event.preventDefault();UI.sBrand='';render()">All brands</a>${brands.map(b => `<a href="#" class="${brand === b ? 'on' : ''}" onclick="event.preventDefault();UI.sBrand='${esc(b)}';render()">${esc(b)}</a>`).join('')}` : ''}
  <h3>Availability</h3><label class="chk"><input type="checkbox" ${only ? 'checked' : ''} onchange="UI.sOnly=this.checked;render()"><span>In stock only</span></label></aside>
  <div><div class="shopbar"><div class="chips">${cats.map(c => `<a href="${link('cat', cat === c ? '' : c)}" class="${cat === c ? 'on' : ''}">${esc(c)}</a>`).join('')}</div><select onchange="shopSort(this.value)" aria-label="Sort products"><option value="feat" ${sort === 'feat' ? 'selected' : ''}>Recommended</option><option value="new" ${sort === 'new' ? 'selected' : ''}>Newest</option><option value="lo" ${sort === 'lo' ? 'selected' : ''}>Price: low to high</option><option value="hi" ${sort === 'hi' ? 'selected' : ''}>Price: high to low</option><option value="deals" ${sort === 'deals' ? 'selected' : ''}>Deals only</option></select></div>
  ${list.length ? `<div class="pgrid">${list.map(pcard).join('')}</div>` : `<div class="card">${emptyBox('search', 'No products match', q ? 'Try a shorter search, or ask us on WhatsApp. We may have it in the shop.' : 'Try another category or clear the filters.', `<a class="btn pri" href="#/shop">See all products</a>`)}</div>`}</div></div>`;
};

function shopSort(v) { const u = new URLSearchParams(route().q); if (v === 'feat') u.delete('sort'); else u.set('sort', v); UI.ssort = v; go('shop' + (u.toString() ? '?' + u : '')) }
const fromPrice = c => { const ps = shopProducts().filter(p => artKey(p.cat) === artKey(c) && av(p.id) > 0).map(p => p.price); return ps.length ? Math.min(...ps) : 0 };

/* ---------- product ---------- */
SV.product = r => {
  const p = prod(r.parts[1]); if (!p || p.active === false) return `<div class="narrow">${emptyBox('box', 'Product not found', 'It may have been removed.', `<a class="btn pri" href="#/shop">Back to the shop</a>`)}</div>`;
  const a = av(p.id), inCart = (cartGet().find(i => i.pid === p.id) || {}).qty || 0, left = a - inCart, wa = waLink(`Hello, I’m interested in ${p.name} (${money(p.price)}).`);
  const rel = shopProducts().filter(x => x.id !== p.id && x.cat === p.cat).sort((x, y) => (av(y.id) > 0) - (av(x.id) > 0)).slice(0, 4);
  const specs = String(p.desc || '').split('\n').map(s => s.trim()).filter(Boolean);
  return `<div class="crumbs"><a href="#/">Home</a>${ic('chev', 14)}<a href="#/shop?cat=${encodeURIComponent(p.cat)}">${esc(p.cat)}</a>${ic('chev', 14)}<span>${esc(p.name)}</span></div>
  <div class="pdp"><div class="pic">${pic(p, 340, 226)}${p.was > p.price ? `<span class="off">${Math.round((1 - p.price / p.was) * 100)}% off</span>` : ''}</div><div class="info"><span class="brandn">${esc(p.brand || p.cat)}</span><h1>${esc(p.name)}</h1>
  <div class="prices">${tag(p, true)}</div>
  <p class="stock">${a ? (a <= 3 ? st(`Only ${a} left`, 'a') : st('In stock', 'g')) : st('Out of stock', 'm')}</p>
  ${a ? `<div class="buyrow"><div class="qty"><button onclick="UI.pq=Math.max(1,(UI.pq||1)-1);$('#pq').textContent=UI.pq" aria-label="One fewer">${ic('minus', 14)}</button><span id="pq">${UI.pq = 1}</span><button onclick="UI.pq=Math.min(${Math.max(1, left)},(UI.pq||1)+1);$('#pq').textContent=UI.pq" aria-label="One more">${ic('plus', 14)}</button></div><button class="btn pri lg" onclick="addToCart('${p.id}',UI.pq||1)" ${left > 0 ? '' : 'disabled'}>${ic('cart', 18)}${left > 0 ? 'Add to cart' : 'All in your cart'}</button><button class="btn gold lg" onclick="buyNow('${p.id}')" ${left > 0 || inCart ? '' : 'disabled'}>Buy now</button></div>` : `<p class="muted" style="margin-top:14px">Call or WhatsApp the shop to ask when it’s back.</p>`}
  ${wa ? `<a class="walink" href="${wa}" target="_blank" rel="noopener">${ic('msg', 17)}Ask about this on WhatsApp</a>` : ''}
  <ul class="perks"><li>${ic('shield', 18)}<span><b>${p.w ?? 12}-month warranty</b>From the day you receive it</span></li><li>${ic('undo', 18)}<span><b>${p.r ?? 7}-day returns</b>If it isn’t right, <a href="#/policies">see the policy</a></span></li><li>${ic('truck', 18)}<span><b>Delivery across Accra</b>Fee by area, shown at checkout</span></li></ul>
  ${specs.length ? `<h2 class="dh">Specifications</h2><ul class="specl">${specs.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}</div></div>
  ${rel.length ? `<section class="sec"><div class="sechd"><h2>More in ${esc(p.cat)}</h2><a href="#/shop?cat=${encodeURIComponent(p.cat)}">See all${ic('chev', 16)}</a></div><div class="pgrid">${rel.map(pcard).join('')}</div></section>` : ''}`;
};
function addToCart(pid, n = 1, btn) {
  const c = cartGet(), x = c.find(i => i.pid === pid), have = x ? x.qty : 0, a = av(pid);
  if (have + n > a) return toast(a ? `Only ${a} available` : 'Out of stock', 'err');
  if (x) x.qty += n; else c.push({ pid, qty: n }); cartSet(c);
  toast(`${prod(pid).name} added to your cart`, 'ok');
  if (btn) { btn.classList.add('done'); btn.innerHTML = `${ic('check', 18, 2)}<span>Added</span>`; setTimeout(() => { if (btn.isConnected) { btn.classList.remove('done'); btn.innerHTML = `${ic('cart', 18)}<span>Add</span>` } }, 1600); return }
  render();
}
function buyNow(pid) { const c = cartGet(); if (!c.find(i => i.pid === pid)) { c.push({ pid, qty: UI.pq || 1 }); cartSet(c) } go('cart') }

/* ---------- cart and checkout ---------- */
SV.cart = () => {
  const c = cartGet().filter(i => prod(i.pid)); const K = UI.ck = UI.ck || ls.get('tle-ck', { name: '', phone: '', email: '', area: '', landmark: '' });
  if (!c.length) return `<div class="narrow">${emptyBox('cart', 'Your cart is empty', 'Find a laptop, phone, camera or accessory you like.', `<a class="btn pri" href="#/shop">Start shopping</a>`)}</div>`;
  const areas = set_('areas'), area = areas.find(a => a.name === K.area), sub = c.reduce((a, i) => a + prod(i.pid).price * i.qty, 0), fee = area ? area.fee : 0;
  const paystack = !!CFG.paystackPublicKey;
  return `<div class="crumbs"><a href="#/">Home</a>${ic('chev', 14)}<span>Checkout</span></div><h1 class="pageh">Checkout</h1><div class="cols c-main"><section class="card"><div class="hd"><h2>Delivery details</h2></div><div class="bd"><p class="small muted">No account needed. We use these details only for this order.</p>
  <label class="f" for="ckN">Full name</label><input id="ckN" value="${esc(K.name)}" oninput="UI.ck.name=this.value" autocomplete="name">
  <div class="fgrid"><div><label class="f" for="ckP">Phone number</label><input id="ckP" value="${esc(K.phone)}" oninput="UI.ck.phone=this.value" inputmode="tel" autocomplete="tel"></div><div><label class="f" for="ckE">Email${paystack ? '' : ' (for your receipt)'}</label><input id="ckE" type="email" value="${esc(K.email)}" oninput="UI.ck.email=this.value" autocomplete="email"></div></div>
  <label class="f" for="ckA">Delivery area</label><select id="ckA" onchange="UI.ck.area=this.value;render()"><option value="">Choose your area</option>${areas.map(a => `<option ${a.name === K.area ? 'selected' : ''} value="${esc(a.name)}">${esc(a.name)}, ${money(a.fee)}</option>`).join('')}</select>
  <label class="f" for="ckL">Landmark or directions</label><input id="ckL" value="${esc(K.landmark)}" oninput="UI.ck.landmark=this.value" autocomplete="street-address" placeholder="e.g. Opposite the Shell station">
  ${paystack ? `<label class="f">Payment</label><div class="seg"><button class="${UI.payM !== 'pod' ? 'on' : ''}" onclick="UI.payM='paystack';render()">Pay now (MoMo or card)</button><button class="${UI.payM === 'pod' ? 'on' : ''}" onclick="UI.payM='pod';render()">Pay on delivery</button></div>` : `<div class="note" style="margin-top:16px">${ic('cash', 16)}<span>Pay on delivery with cash or mobile money. We’ll call to confirm before sending.</span></div>`}</div></section>
  <section class="card"><div class="hd"><h2>Your order</h2><span class="sp"></span><span class="small muted">${cartCount()} item${cartCount() === 1 ? '' : 's'}</span></div><div class="bd" style="padding-top:4px">${c.map((i, k) => { const p = prod(i.pid); return `<div class="line"><a class="thumb" href="#/p/${p.id}">${pic(p, 40, 28)}</a><div class="grow"><div class="strong">${esc(p.name)}</div><div class="row between" style="margin-top:8px"><div class="qty"><button onclick="cartQty(${k},-1)" aria-label="One fewer">${ic('minus', 14)}</button><span>${i.qty}</span><button onclick="cartQty(${k},1)" aria-label="One more">${ic('plus', 14)}</button></div><span class="strong">${money(p.price * i.qty)}</span></div></div></div>` }).join('')}
  <div style="margin-top:8px"><div class="tot"><span>Subtotal</span><span>${money(sub)}</span></div><div class="tot"><span>Delivery${area ? ' to ' + esc(area.name) : ''}</span><span>${area ? money(fee) : 'Choose an area'}</span></div><div class="tot big"><span>Total</span><span>${money(sub + fee)}</span></div></div>
  <button class="btn pri lg block" style="margin-top:14px" onclick="act(this,checkout)">${paystack && UI.payM !== 'pod' ? `${ic('lock', 16)}Pay ${money(sub + fee)}` : 'Place order'}</button>
  <p class="small muted" style="margin-top:12px">By placing your order you agree to our <a href="#/terms">terms of sale</a>. See how we handle your details in our <a href="#/privacy">privacy policy</a>.</p></div></section></div>`;
};
function cartQty(k, d) { const c = cartGet(), i = c[k]; i.qty += d; if (i.qty > av(i.pid)) { i.qty -= d; return toast('No more of this item in stock', 'err') } if (i.qty < 1) c.splice(k, 1); cartSet(c); render() }
async function checkout() {
  const K = UI.ck, c = cartGet(); ls.set('tle-ck', K);
  if (!K.name.trim() || normPhone(K.phone).length < 9) throw new Error('Add your name and phone number.');
  if (K.email.trim() && !/^\S+@\S+\.\S+$/.test(K.email.trim())) throw new Error('Check your email address.');
  if (!K.area) throw new Error('Choose a delivery area.');
  const base = { items: c.map(i => ({ pid: i.pid, qty: i.qty })), name: K.name.trim(), phone: K.phone.trim(), email: K.email.trim(), area: K.area, landmark: K.landmark.trim() };
  if (CFG.paystackPublicKey && UI.payM !== 'pod') {
    if (!/^\S+@\S+\.\S+$/.test(K.email)) throw new Error('Add your email to pay online.');
    await API.catalog(); for (const i of c) if (i.qty > av(i.pid)) throw new Error(`Only ${av(i.pid)} of ${prod(i.pid).name} left.`);
    const total = c.reduce((a, i) => a + prod(i.pid).price * i.qty, 0) + (set_('areas').find(a => a.name === K.area) || {}).fee;
    await loadScript('https://js.paystack.co/v2/inline.js');
    const ref = await new Promise((res, rej) => { new window.PaystackPop().newTransaction({ key: CFG.paystackPublicKey, email: K.email.trim(), amount: Math.round(total * 100), currency: 'GHS', onSuccess: t => res(t.reference), onCancel: () => rej(new Error('Payment cancelled.')) }) });
    return finishOrder(await API.placeOrder({ ...base, payment: 'paystack', ref }));
  }
  finishOrder(await API.placeOrder({ ...base, payment: 'pod' }));
}
function finishOrder(o) { cartSet([]); ls.set('tle-last-order', { no: o.no, phone: UI.ck.phone, email: !!UI.ck.email.trim() }); if (UI.ck.email.trim()) emailReceipt({ order: o.no }); go('done/' + o.no) }
function loadScript(src) { return new Promise((res, rej) => { if (document.querySelector(`script[src="${src}"]`)) return res(); const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Couldn’t load the payment window. Check your connection.')); document.head.appendChild(s) }) }
SV.done = r => { const last = ls.get('tle-last-order', {}); return `<div class="narrow"><div class="verify"><div class="t">${ic('check', 18, 2)}Thank you. Your order is in.</div><p>Your order number is <span class="mono strong">${esc(r.parts[1])}</span>. We’ll call you shortly to confirm delivery.${last.email ? ' We’ll also email your receipt when your order is packed.' : ''}</p></div>
  <ol class="howsteps small"><li><b>We call to confirm</b><span>Usually within working hours on the same day.</span></li><li><b>We pack your order</b><span>Each device is checked before it leaves the shop.</span></li><li><b>Our rider delivers</b><span>Keep your phone on so the rider can reach you.</span></li></ol>
  <div class="row"><a class="btn pri" href="#/track?no=${esc(r.parts[1])}">Track this order</a><a class="btn" href="#/shop">Continue shopping</a></div></div>` };

/* ---------- tracking ---------- */
SV.track = r => {
  const last = ls.get('tle-last-order', {}), no = r.q.get('no') || UI.tNo || last.no || '', ph = UI.tPh || (no === last.no ? last.phone : '') || '';
  const steps = ['placed', 'packed', 'out', 'delivered'], lbl = { placed: 'Order received', packed: 'Packed', out: 'On the way', delivered: 'Delivered' };
  const res = UI.tRes; const o = res && res.no === no ? res : null; const cur = o ? (o.status === 'paid' || o.status === 'pod' ? 0 : steps.indexOf(o.status)) : -1;
  return `<div class="narrow"><h1>Track an order</h1><p class="muted" style="margin:6px 0 20px">Use the order number from your confirmation and the phone number you checked out with.</p>
  <section class="card"><div class="bd"><div class="fgrid"><div><label class="f" for="tq" style="margin-top:0">Order number</label><input id="tq" class="mono" value="${esc(no)}" placeholder="ORD-…"></div><div><label class="f" for="tp" style="margin-top:0">Phone number</label><input id="tp" value="${esc(ph)}" inputmode="tel"></div></div><button class="btn pri" style="margin-top:16px" onclick="act(this,trackIt)">Track order</button></div></section>
  ${o ? `<section class="card"><div class="bd"><div class="row between"><span class="mono strong">${esc(o.no)}</span>${o.status === 'cancelled' ? st('Cancelled', 'm') : st(lbl[steps[Math.max(0, cur)]], cur === 3 ? 'g' : 'b')}</div>${o.status === 'cancelled' ? '<p class="small muted" style="margin-top:10px">This order was cancelled. Call the shop if you have questions.</p>' : `<div class="steps">${steps.map((s, i) => `<span class="${i < cur ? 'done' : i === cur ? 'cur' : ''}">${lbl[s]}</span>`).join('')}</div>`}${o.rider ? `<p class="small" style="margin-top:12px">Your rider: ${esc(o.rider)}</p>` : ''}${o.items && o.items.length ? `<div style="margin-top:14px">${o.items.map(i => `<div class="tot"><span>${esc((prod(i.pid) || {}).name || 'Item')} × ${i.qty}</span><span>${money(i.price * i.qty)}</span></div>`).join('')}${o.total != null ? `<div class="tot big"><span>Total</span><span>${money(o.total)}</span></div>` : ''}</div>` : ''}</div></section>` : UI.tErr ? `<div class="refuse">${ic('alert', 16)}<span>${esc(UI.tErr)}</span></div>` : ''}</div>`;
};
async function trackIt() { UI.tNo = val('tq').trim().toUpperCase(); UI.tPh = val('tp').trim(); UI.tErr = ''; UI.tRes = null; if (!UI.tNo || normPhone(UI.tPh).length < 9) { UI.tErr = 'Enter the order number and the phone number used.'; return render() } const o = await API.track(UI.tNo, UI.tPh); if (o) UI.tRes = { ...o, no: o.no || o.id }; else UI.tErr = 'No order matches that number and phone number.'; render() }

/* ---------- returns and warranty ---------- */
const findSerialHelp = `<details class="where"><summary>Where do I find the serial number?</summary><p>It’s printed on your receipt next to each item (it starts with S/N), and on the emailed receipt if you gave your email. You’ll also find it on a sticker under or behind the device, or in the device settings (on phones, dial *#06# or open Settings, About).</p></details>`;
SV.returns = () => {
  const R = UI.sRet;
  if (R && R.done) return `<div class="narrow"><div class="verify"><div class="t">${ic('check', 18, 2)}Return request sent</div><p>Your return number is <span class="mono strong">${esc(R.done)}</span>. Bring or send the device to the shop with its charger and accessories. We’ll check it and call you about the next step.</p></div><button class="btn" onclick="UI.sRet=null;render()">Start another return</button></div>`;
  if (R && R.v) { const v = R.v; return `<div class="narrow"><h1>Return an item</h1><ol class="stepper"><li class="done">Find your purchase</li><li class="cur">Tell us what’s wrong</li><li>Bring the device</li></ol><div class="verify" style="margin-top:6px"><div class="t">${ic('shield', 18)}${esc(v.product)}</div><p class="small">Bought ${fmtD(v.saleT)}. ${st(v.cov, v.covK === 'window' ? 'g' : v.covK === 'warranty' ? 'b' : 'r')}</p></div>
  ${v.covK === 'expired' ? `<div class="note" style="margin-bottom:16px">${ic('alert', 16)}<span>This item is out of warranty. You can still send the request and the shop will review it.</span></div>` : ''}
  <section class="card"><div class="bd"><label class="f" for="srR" style="margin-top:0">What’s wrong?</label><select id="srR">${REASONS.map(o => `<option>${o}</option>`).join('')}</select><label class="f" for="srD">Describe the problem</label><textarea id="srD" rows="3" placeholder="What happens, and since when?"></textarea><label class="f" for="srP">Photos of the fault (optional)</label><input id="srP" type="file" multiple accept="image/*"></div>
  <div class="ft"><button class="btn" onclick="UI.sRet=null;render()">Back</button><button class="btn pri" onclick="act(this,submitOnlineReturn)">Send return request</button></div></section></div>` }
  return `<div class="narrow"><h1>Return an item</h1><p class="muted" style="margin:6px 0 18px">Something not right? Start a return in three steps. Read the <a href="#/policies">returns and warranty policy</a> for what’s covered.</p>
  <ol class="stepper"><li class="cur">Find your purchase</li><li>Tell us what’s wrong</li><li>Bring the device</li></ol>
  <section class="card"><div class="bd"><label class="f" for="srS" style="margin-top:0">Serial number from your receipt</label><input id="srS" class="mono" autocomplete="off" autocapitalize="characters" spellcheck="false"><label class="f" for="srC">Phone number or email you bought with</label><input id="srC"><button class="btn pri" style="margin-top:16px" onclick="act(this,checkOnlineReturn)">Find my purchase</button><div id="srMsg" style="margin-top:12px"></div>${findSerialHelp}</div></section></div>`;
};
async function checkOnlineReturn() {
  UI.attempts = (UI.attempts || 0); if (UI.attempts >= 6) { $('#srMsg').innerHTML = `<div class="refuse">${ic('alert', 16)}<span>Too many attempts. Please try again later or contact the shop.</span></div>`; return }
  const v = await API.verify(val('srS'), val('srC'));
  if (!v.ok) { UI.attempts++; $('#srMsg').innerHTML = `<div class="refuse">${ic('alert', 16)}<span>${esc(v.msg)}</span></div>`; return }
  if (v.open) { $('#srMsg').innerHTML = `<div class="refuse">${ic('alert', 16)}<span>A return is already open for this item. The shop will be in touch.</span></div>`; return }
  UI.attempts = 0; UI.sRet = { v, contact: val('srC') }; render();
}
async function submitOnlineReturn() {
  const R = UI.sRet, photos = await uploadMany($('#srP'), 'return-photos');
  const res = await API.fileReturn({ serial: R.v.serial, contact: R.contact, reason: val('srR'), desc: val('srD').trim(), photos });
  UI.sRet = { done: res.rma }; render();
}
SV.warranty = () => `<div class="narrow"><h1>Check a warranty</h1><p class="muted" style="margin:6px 0 18px">See how long your device is covered for.</p>
  <ol class="stepper"><li class="cur">Enter the serial number from your receipt</li><li>Add the phone number or email you bought with</li><li>See your cover</li></ol>
  <section class="card"><div class="bd"><label class="f" for="wS" style="margin-top:0">Serial number</label><input id="wS" class="mono" autocapitalize="characters" spellcheck="false"><label class="f" for="wC">Phone number or email</label><input id="wC"><button class="btn pri" style="margin-top:16px" onclick="act(this,checkWarranty)">Check warranty</button><div id="wMsg" style="margin-top:12px"></div>${findSerialHelp}</div></section></div>`;
async function checkWarranty() {
  const v = await API.verify(val('wS'), val('wC'));
  $('#wMsg').innerHTML = v.ok ? `<div class="verify" style="margin:0"><div class="t">${ic('shield', 18)}${esc(v.product)}</div><p>${st(v.cov, v.covK === 'window' ? 'g' : v.covK === 'warranty' ? 'b' : 'r')}</p><p class="small muted" style="margin-top:10px">Bought ${fmtD(v.saleT)}. Need help with it? <a href="#/returns">Start a return</a></p></div>` : `<div class="refuse">${ic('alert', 16)}<span>${esc(v.msg)}</span></div>`;
}

/* ---------- blog ---------- */
const bcard = p => `<a class="bcard" href="#/blog/${esc(p.id)}"><div class="bpic">${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy">` : `<span>${art({ cat: p.tag }, 120, 80)}</span>`}</div><div class="bmeta"><span class="btag">${esc(p.tag || 'News')}</span><b>${esc(p.title)}</b><p>${esc(p.excerpt || '')}</p><span class="small muted">${fmtD(p.t)}</span></div></a>`;
SV.blog = r => {
  const posts = set_('blog') || [], id = r.parts[1];
  if (id) {
    const p = posts.find(x => x.id === id); if (!p) return `<div class="narrow">${emptyBox('doc', 'Post not found', 'It may have been removed.', `<a class="btn pri" href="#/blog">All posts</a>`)}</div>`;
    const more = posts.filter(x => x.id !== id).slice(0, 3), share = encodeURIComponent(`${p.title} ${location.origin}/#/blog/${p.id}`);
    return `<article class="post"><div class="crumbs"><a href="#/">Home</a>${ic('chev', 14)}<a href="#/blog">Blog</a>${ic('chev', 14)}<span>${esc(p.tag || 'Post')}</span></div>
    <span class="btag">${esc(p.tag || 'News')}</span><h1>${esc(p.title)}</h1><p class="muted">${fmtD(p.t)}${p.by ? ', by ' + esc(p.by) : ''}</p>${p.cover ? `<img class="cover" src="${esc(p.cover)}" alt="">` : ''}
    <div class="prose">${md(p.body)}</div><div class="row" style="margin-top:28px"><a class="btn" href="https://wa.me/?text=${share}" target="_blank" rel="noopener">${ic('msg', 16)}Share on WhatsApp</a><a class="btn ghost" href="#/blog">${ic('back', 15)}All posts</a></div></article>
    ${more.length ? `<section class="sec"><div class="sechd"><h2>More from the blog</h2></div><div class="bgrid">${more.map(bcard).join('')}</div></section>` : ''}`;
  }
  const [first, ...rest] = posts;
  return `<div class="crumbs"><a href="#/">Home</a>${ic('chev', 14)}<span>Blog</span></div><div class="shophd"><h1>Blog</h1><span class="muted">Tech news, buying guides and updates from the shop</span></div>
  ${first ? `<a class="bfeat" href="#/blog/${esc(first.id)}"><div class="bpic">${first.cover ? `<img src="${esc(first.cover)}" alt="">` : `<span>${art({ cat: first.tag }, 200, 134)}</span>`}</div><div class="bmeta"><span class="btag">${esc(first.tag || 'News')}</span><h2>${esc(first.title)}</h2><p>${esc(first.excerpt || '')}</p><span class="small muted">${fmtD(first.t)}</span></div></a>
  ${rest.length ? `<div class="bgrid" style="margin-top:22px">${rest.map(bcard).join('')}</div>` : ''}` : `<div class="card">${emptyBox('doc', 'No posts yet', 'Check back soon for tech news and buying guides.', `<a class="btn pri" href="#/shop">Browse products</a>`)}</div>`}`;
};

/* ---------- contact ---------- */
SV.contact = () => {
  const s = set_('store'), wa = waLink('Hello PriceRight, '), map = s.map || (s.address ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(s.name + ' ' + s.address) : '');
  if (UI.cDone) return `<div class="narrow"><div class="verify"><div class="t">${ic('check', 18, 2)}Message sent</div><p>Thanks. We’ve got your message (reference <span class="mono strong">${esc(UI.cDone)}</span>) and will reply by phone or email, usually within one working day.</p></div><button class="btn" onclick="UI.cDone=null;render()">Send another message</button></div>`;
  return `<div class="crumbs"><a href="#/">Home</a>${ic('chev', 14)}<span>Contact us</span></div><div class="shophd"><h1>Contact us</h1><span class="muted">Questions about a product, an order or a repair? We’re happy to help.</span></div>
  <div class="contact"><div class="ways">${s.phone ? `<a class="way" href="tel:${esc(s.phone)}">${ic('phone', 22)}<span><b>Call us</b>${esc(s.phone)}</span></a>` : ''}${wa ? `<a class="way" href="${wa}" target="_blank" rel="noopener">${ic('msg', 22)}<span><b>WhatsApp</b>Chat with the shop</span></a>` : ''}${s.email ? `<a class="way" href="mailto:${esc(s.email)}">${ic('mail', 22)}<span><b>Email</b>${esc(s.email)}</span></a>` : ''}
  <div class="way">${ic('pin', 22)}<span><b>Visit the shop</b>${esc(s.address || 'Accra, Ghana')}${s.hours ? `<br>${esc(s.hours)}` : ''}${map ? `<br><a href="${esc(map)}" target="_blank" rel="noopener">Get directions</a>` : ''}</span></div></div>
  <section class="card"><div class="hd"><h2>Send us a message</h2></div><div class="bd"><div class="fgrid"><div class="full"><label class="f" for="cmN" style="margin-top:0">Your name</label><input id="cmN" autocomplete="name"></div><div><label class="f" for="cmP">Phone number</label><input id="cmP" inputmode="tel" autocomplete="tel"></div><div><label class="f" for="cmE">Email</label><input id="cmE" type="email" autocomplete="email"></div>
  <div class="full"><label class="f" for="cmT">What is it about?</label><select id="cmT"><option>Help choosing a product</option><option>An order I placed</option><option>Returns, repairs or warranty</option><option>Business or bulk order</option><option>Something else</option></select></div>
  <div class="full"><label class="f" for="cmM">Message</label><textarea id="cmM" rows="5"></textarea></div></div>
  <p class="small muted" style="margin-top:12px">We use your details only to reply to you. See our <a href="#/privacy">privacy policy</a>.</p>
  <button class="btn pri lg" style="margin-top:14px" onclick="act(this,sendContact)">Send message</button></div></section></div>
  ${s.address ? `<div class="mapbox"><iframe title="Map to ${esc(s.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(s.name + ', ' + s.address)}&output=embed"></iframe></div>` : ''}`;
};
async function sendContact() {
  const m = { name: val('cmN').trim(), phone: val('cmP').trim(), email: val('cmE').trim(), topic: val('cmT'), message: val('cmM').trim() };
  if (m.name.length < 2) throw new Error('Add your name.'); if (normPhone(m.phone).length < 9 && !/^\S+@\S+\.\S+$/.test(m.email)) throw new Error('Add a phone number or email so we can reply.'); if (m.message.length < 5) throw new Error('Write your message.');
  UI.cDone = await API.contact(m); render(); scrollTo(0, 0);
}

/* ---------- legal pages ---------- */
SV.legal = r => {
  const page = r.parts[0], s = set_('store'), D = LEGAL[page](s);
  return `<div class="crumbs"><a href="#/">Home</a>${ic('chev', 14)}<span>${D.title}</span></div><div class="legal"><nav class="toc"><b>On this page</b>${D.sections.map((x, i) => `<a href="#/${page}" onclick="event.preventDefault();document.getElementById('lg${i}').scrollIntoView({behavior:'smooth'})">${x[0]}</a>`).join('')}<b style="margin-top:18px">Policies</b><a href="#/privacy" class="${page === 'privacy' ? 'on' : ''}">Privacy policy</a><a href="#/terms" class="${page === 'terms' ? 'on' : ''}">Terms of sale</a><a href="#/policies" class="${page === 'policies' ? 'on' : ''}">Returns and warranty</a></nav>
  <article class="prose"><h1>${D.title}</h1><p class="muted">Last updated 3 November 2026</p>${D.intro ? `<p>${D.intro}</p>` : ''}${D.sections.map((x, i) => `<h2 id="lg${i}">${x[0]}</h2>${x[1]}`).join('')}</article></div>`;
};
const contactLine = s => [s.phone && `phone ${esc(s.phone)}`, s.email && `email <a href="mailto:${esc(s.email)}">${esc(s.email)}</a>`, s.address && `or visit us at ${esc(s.address)}`].filter(Boolean).join(', ') || 'use our <a href="#/contact">contact page</a>';
const LEGAL = {
  privacy: s => ({
    title: 'Privacy policy',
    intro: `${esc(s.name)} (“we”, “us”) respects your privacy. This policy explains what personal data we collect when you shop with us in store or online, why we collect it, and the rights you have under Ghana’s Data Protection Act, 2012 (Act 843).`,
    sections: [
      ['Who we are', `<p>${esc(s.name)} is the data controller for the personal data described here. To reach us about your data, ${contactLine(s)}.</p>`],
      ['What we collect', `<ul><li><b>Contact details:</b> your name, phone number, email address (if you give it) and delivery area or landmark.</li><li><b>Purchase records:</b> what you bought, prices, payment method and transaction reference, and the serial number of each device, so we can honour warranties and returns.</li><li><b>Returns and repairs:</b> the problem you describe and any photos you send.</li><li><b>Messages:</b> what you send us through the contact form, phone, WhatsApp or email.</li></ul><p>We do not collect card numbers. Online card and mobile money payments are handled by our payment provider, Paystack, under its own privacy policy.</p>`],
      ['Why we use it', `<p>We use your data to:</p><ul><li>process, deliver and support your order (needed to perform our contract with you);</li><li>issue receipts, including by email when you give us an address;</li><li>verify purchases for returns and warranty claims, and prevent fraud (our legitimate interest in protecting customers and stock);</li><li>keep accounting and tax records (a legal obligation);</li><li>reply to your questions.</li></ul><p>We will only send you marketing messages if you ask us to, and you can stop them at any time.</p>`],
      ['Who we share it with', `<p>We never sell your personal data. We share only what is needed with:</p><ul><li>our delivery riders, who receive your name, phone number and delivery details;</li><li>Paystack, when you pay online;</li><li>service providers who host our systems and send our emails (such as Supabase, Vercel and our email provider). Some of these store data on servers outside Ghana. We use providers that protect data to a standard at least equal to Act 843;</li><li>authorities, where the law requires it.</li></ul>`],
      ['How long we keep it', `<p>We keep purchase and receipt records for as long as tax and accounting law requires, and at least until your warranty ends. Contact form messages are kept for up to 24 months. When data is no longer needed, we delete or anonymise it.</p>`],
      ['How we protect it', `<p>Access to customer data is limited to staff who need it and protected by individual logins. Data is encrypted in transit. Shop staff are trained to handle customer data carefully.</p>`],
      ['Your rights', `<p>Under Act 843 you can:</p><ul><li>ask for a copy of the personal data we hold about you;</li><li>ask us to correct data that is wrong or incomplete;</li><li>ask us to delete data we no longer need, or object to how we use it;</li><li>withdraw consent where we rely on it, such as for marketing.</li></ul><p>To make a request, ${contactLine(s)}. We will reply within 21 days. If you are not satisfied, you can complain to the Data Protection Commission of Ghana.</p>`],
      ['Your browser', `<p>Our website stores your cart and checkout details in your own browser so they are there when you come back. This is needed for the shop to work, and is not used for advertising or tracking. Clearing your browser data removes it. If you watch the map on our contact page, Google may set its own cookies.</p>`],
      ['Children', `<p>Our online shop is meant for adults. We do not knowingly collect data from children under 18 without a parent’s or guardian’s consent.</p>`],
      ['Changes to this policy', `<p>We may update this policy. The date at the top shows when it last changed.</p>`]
    ]
  }),
  terms: s => ({
    title: 'Terms of sale',
    intro: `These terms apply when you buy from ${esc(s.name)} in our shop or through this website. Please read them with our <a href="#/policies">returns and warranty policy</a> and <a href="#/privacy">privacy policy</a>.`,
    sections: [
      ['Prices and stock', `<p>Prices are in Ghana cedis (GH₵) and are shown on each product. We check stock when you place an order. If something becomes unavailable or a price was shown in error, we will call you before sending and you can change or cancel the order.</p>`],
      ['Placing an order', `<p>Your order is confirmed when we call or message you to arrange delivery. We may decline or cancel an order, for example if we cannot reach you or cannot verify a payment. If you have already paid, we refund you in full.</p>`],
      ['Payment', `<p>You can pay on delivery with cash or mobile money${CFG.paystackPublicKey ? ', or online by mobile money or card through Paystack' : ''}. Online payments are processed by Paystack; we never see your card details.</p>`],
      ['Delivery', `<p>Our own riders deliver across Accra. The delivery fee depends on your area and is shown at checkout. Please check the device and accessories when they arrive. You can track your order on our <a href="#/track">tracking page</a>.</p>`],
      ['Receipts and serial numbers', `<p>Every device we sell is recorded against its serial number, which appears on your receipt. Keep your receipt, or the emailed copy, as proof of purchase. The serial number is how we confirm a device was bought from us for returns and warranty claims.</p>`],
      ['Returns and warranty', `<p>Our <a href="#/policies">returns and warranty policy</a> explains what is covered and how to make a claim. Nothing in these terms takes away rights you have under Ghanaian law.</p>`],
      ['Contact', `<p>Questions about these terms? ${contactLine(s).replace(/^./, c => c.toUpperCase())}.</p>`]
    ]
  }),
  policies: s => ({
    title: 'Returns and warranty policy',
    intro: `We want you to be happy with what you buy. Each product page shows its return window and warranty period, and both are printed on your receipt.`,
    sections: [
      ['Returns', `<p>Within the return window shown for your product (usually 7 days from purchase), you can return a device that is faulty or not as described. Bring it back in its original condition with the box, charger and accessories.</p><p>We cannot accept returns for change of mind on opened software, devices with physical or water damage, or items whose serial number does not match our records.</p>`],
      ['Warranty', `<p>Most devices carry a warranty from the date of purchase, shown on the product page and your receipt. The warranty covers faults in materials and workmanship. It does not cover accidental damage, liquid damage, power surges, unauthorised repairs or normal wear.</p>`],
      ['How to make a claim', `<ol><li>Find the serial number on your receipt or emailed receipt.</li><li>Start a claim on our <a href="#/returns">returns page</a> with the serial number and the phone number or email you bought with, or bring the device to the shop.</li><li>Bring or send the device to the shop. We check that its serial matches your purchase and inspect it.</li><li>We call you with the outcome: repair, replacement, refund or store credit, depending on the fault and the policy.</li></ol>`],
      ['Refunds', `<p>Approved refunds are paid back the way you paid where possible (cash, mobile money, or to your card through Paystack). Delivery fees are refunded when the item was faulty or wrong.</p>`],
      ['Check your cover', `<p>You can check how long a device is covered on our <a href="#/warranty">warranty check page</a>.</p>`]
    ]
  })
};

/* ================= boot ================= */
(async function boot() {
  try {
    if (REMOTE) {
      if (!window.supabase) await new Promise(r => { const t = setInterval(() => { if (window.supabase) { clearInterval(t); r() } }, 50); setTimeout(() => { clearInterval(t); r() }, 8000) });
      if (!window.supabase) throw new Error('Couldn’t reach the server. Check your connection and reload.');
      sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } });
      NET.outbox = (await idb.get('outbox')) || [];
    } else {
      const d = await idb.get('data');
      if (d) { COLL.forEach(c => S[c] = d[c] || {}); S.costs = d.costs || {}; S.staff = d.staff || {} }
      Object.entries(LOCAL_STAFF).forEach(([k, v]) => { if (!S.staff[k]) S.staff[k] = v });
    }
    if (IS_STAFF) {
      if (REMOTE) {
        const { data } = await sb.auth.getSession();
        if (data && data.session) {
          const email = data.session.user.email.toLowerCase();
          try { await afterRemoteSignIn(email) } catch (e) {
            if (isNetErr(e)) { const cache = await idb.get('cache:' + email); const role = (cache && cache.staff && cache.staff[email] || {}).role || ls.get('tle-role:' + email); if (cache && role) { COLL.forEach(c => S[c] = cache[c] || {}); S.costs = cache.costs || {}; S.staff = cache.staff || {}; ME = { email, role, name: (S.staff[email] || {}).name || '' }; NET.online = false } }
          }
          if (ME) ls.set('tle-role:' + ME.email, ME.role);
        }
        sb.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_OUT' && ME) { ME = null; render() } if (ev === 'PASSWORD_RECOVERY') setTimeout(newPassword, 300) });
      } else {
        const e = ls.get('tle-session'); const a = e && S.staff[e]; if (a) ME = { email: e, role: a.role, name: a.name };
      }
      if (ME && (!location.hash || location.hash === '#/')) history.replaceState(null, '', '#/dashboard');
    } else {
      try { await API.catalog() } catch (e) { UI.avail = {} }
    }
  } catch (e) { console.error(e); toast(friendlyErr(e.message), 'err') }
  render();
})();
function newPassword() {
  modal('Choose a new password', `<label class="f" for="npw" style="margin-top:0">New password</label><input id="npw" type="password" autocomplete="new-password" autofocus><p class="hint">At least 8 characters.</p>`,
    `<button class="btn pri" onclick="act(this,async()=>{const p=val('npw');if(p.length<8)throw new Error('Use at least 8 characters.');const {error}=await sb.auth.updateUser({password:p});if(error)throw error;closeModal();toast('Password updated','ok')})">Save password</button>`);
}
