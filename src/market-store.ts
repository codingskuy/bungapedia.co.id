// Bungapedia marketplace state — localStorage persistence + error handling eksplisit.
// Prinsip: semua aksi async punya loading/error, semua form punya validasi,
// semua route param yang hilang menghasilkan error UI yang bisa dipulihkan (bukan blank).

import { derived, writable } from 'svelte/store';
import type { AppError, CheckoutDraft, MarketProduct, Order, OrderItem, OrderStatus, PaymentMethod } from './market-types';
import { DELIVERY_FEE, PLATFORM_FEE, SEED_ORDERS, productById } from './market-data';
import { currentCustomer } from './auth';

function persist<T>(key: string, store: { subscribe: (fn: (v: T) => void) => unknown }) {
  store.subscribe((v) => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* storage penuh / private mode — abaikan, state tetap jalan di memori */
    }
  });
}
function restore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ---------- toast ----------
export const toast = writable('');
let toastTimer: ReturnType<typeof setTimeout>;
export function showToast(msg: string) {
  toast.set(msg);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.set(''), 2800);
}

// ---------- error global ----------
export const appError = writable<AppError | null>(null);
export function raiseError(code: string, message: string, recover: string) {
  appError.set({ code, message, recover });
}
export function clearError() {
  appError.set(null);
}

// ---------- wishlist ----------
export const wishlist = writable<string[]>(restore('bp-wishlist', []));
persist('bp-wishlist', wishlist);
export function toggleWishlist(id: string) {
  wishlist.update((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
}

// ---------- cart marketplace (satu partner per checkout — asumsi sederhana & didokumentasikan) ----------
export interface CartLine extends OrderItem {
  qty: number;
}
export const cart = writable<CartLine[]>(restore('bp-cart', []));
persist('bp-cart', cart);
export const cartCount = derived(cart, ($c) => $c.reduce((n, l) => n + l.qty, 0));
export const cartTotal = derived(cart, ($c) => $c.reduce((n, l) => n + l.qty * l.price, 0));
export const cartPartnerId = derived(cart, ($c) => ($c.length ? $c[0].partnerId : null));

export function addMarketToCart(p: MarketProduct, qty = 1): boolean {
  let ok = true;
  cart.update((cs) => {
    if (cs.length > 0 && cs[0].partnerId !== p.partnerId) {
      raiseError(
        'mixed-partner',
        'Keranjang marketplace hanya untuk satu partner per pesanan agar produksi & pengiriman jelas.',
        'Selesaikan pesanan ini dulu, atau kosongkan keranjang untuk ganti partner.'
      );
      ok = false;
      return cs;
    }
    const ex = cs.find((l) => l.productId === p.id);
    if (ex) return cs.map((l) => (l.productId === p.id ? { ...l, qty: l.qty + qty } : l));
    return [...cs, { productId: p.id, name: p.name, img: p.img, price: p.price, qty, partnerId: p.partnerId }];
  });
  if (ok) showToast(`${p.name} masuk keranjang`);
  return ok;
}
export function bumpMarketQty(id: string, d: number) {
  cart.update((cs) => cs.map((l) => (l.productId === id ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0));
}
export function clearMarketCart() {
  cart.set([]);
  try {
    localStorage.removeItem('bp-cart');
  } catch { /* noop */ }
}

// ---------- orders ----------
export const orders = writable<Order[]>(restore('bp-orders', SEED_ORDERS));
persist('bp-orders', orders);
export function orderById(id: string): Order | undefined {
  let found: Order | undefined;
  orders.subscribe((os) => {
    found = os.find((o) => o.id === id);
  })();
  return found;
}
export function updateOrderStatus(id: string, status: OrderStatus) {
  orders.update((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
}

// ---------- checkout draft ----------
const DRAFT_KEY = 'bp-draft';
export const draft = writable<CheckoutDraft>(
  restore(DRAFT_KEY, {
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    deliveryDate: '',
    deliveryTime: '10:00–13:00',
    deliveryNote: '',
    message: '',
    paymentMethod: 'qris' as PaymentMethod,
  })
);
persist(DRAFT_KEY, draft);

export interface FieldErrors {
  [k: string]: string;
}
export function validateDraft(d: CheckoutDraft, cartEmpty: boolean): FieldErrors {
  const e: FieldErrors = {};
  if (cartEmpty) e.cart = 'Keranjang masih kosong. Tambahkan minimal 1 produk dulu.';
  if (d.recipientName.trim().length < 3) e.recipientName = 'Nama penerima minimal 3 karakter.';
  if (!/^(\+?62|0)8\d{7,11}$/.test(d.recipientPhone.replace(/[\s-]/g, '')))
    e.recipientPhone = 'Nomor HP tidak valid. Contoh: 0812xxxxxxx.';
  if (d.recipientAddress.trim().length < 10) e.recipientAddress = 'Alamat minimal 10 karakter agar kurir tidak nyasar.';
  if (!d.deliveryDate) e.deliveryDate = 'Pilih tanggal pengiriman.';
  if (!d.message.trim()) e.message = 'Tulis kartu ucapan — ini inti momennya.';
  return e;
}

// ---------- simulated payment ----------
// Simulasi: QRIS/e-wallet sukses 1.6 detik; transfer 2.2 detik.
// Untuk melatih error handling: metode "transfer" gagal 1x jika total ganjil? Tidak —
// dibuat deterministik: selalu sukses, kecuali user menekan "Simulasikan gagal" di UI.
export const payState = writable<{ loading: boolean; error: string | null }>({ loading: false, error: null });

export function placeOrder(d: CheckoutDraft): Order | null {
  let lines: CartLine[] = [];
  cart.subscribe((c) => (lines = c))();
  const errs = validateDraft(d, lines.length === 0);
  if (Object.keys(errs).length > 0) return null;
  const productTotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const total = productTotal + DELIVERY_FEE + PLATFORM_FEE;
  const id = `INV-2026-${String(Math.floor(100 + Math.random() * 900))}`;
  const me = currentCustomer();
  const order: Order = {
    id,
    customerId: me?.customerId ?? 'c-guest',
    customerName: me?.name ?? d.recipientName,
    items: lines,
    partnerId: lines[0].partnerId,
    productTotal,
    deliveryFee: DELIVERY_FEE,
    platformFee: PLATFORM_FEE,
    total,
    recipient: { name: d.recipientName, phone: d.recipientPhone, address: d.recipientAddress },
    delivery: { date: d.deliveryDate, time: d.deliveryTime, note: d.deliveryNote },
    message: d.message,
    paymentMethod: d.paymentMethod,
    paymentStatus: 'unpaid',
    status: 'pending_payment',
    settlement: 'pending',
    createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    timeline: (['pending_payment', 'paid', 'accepted', 'preparing', 'ready', 'shipped', 'delivered', 'completed'] as OrderStatus[]).map(
      (key, i) => ({ key, at: i === 0 ? 'baru saja' : '—', done: i === 0 })
    ),
  };
  orders.update((os) => [order, ...os]);
  clearMarketCart();
  return order;
}

export async function simulatePayment(orderId: string, fail = false): Promise<boolean> {
  payState.set({ loading: true, error: null });
  const order = orderById(orderId);
  const delay = order?.paymentMethod === 'transfer' ? 2200 : 1600;
  await new Promise((r) => setTimeout(r, delay));
  if (fail) {
    payState.set({ loading: false, error: 'Simulasi pembayaran gagal (timeout gateway). Saldo tidak terpotong. Coba lagi.' });
    return false;
  }
  orders.update((os) =>
    os.map((o) =>
      o.id === orderId
        ? {
            ...o,
            paymentStatus: 'paid',
            status: 'paid',
            timeline: o.timeline.map((t) => (t.key === 'paid' || t.key === 'pending_payment' ? { ...t, done: true, at: 'baru saja' } : t)),
          }
        : o
    )
  );
  payState.set({ loading: false, error: null });
  return true;
}

export function confirmReceived(orderId: string) {
  orders.update((os) =>
    os.map((o) =>
      o.id === orderId
        ? { ...o, status: 'completed', settlement: 'available', timeline: o.timeline.map((t) => ({ ...t, done: true })) }
        : o
    )
  );
  showToast('Pesanan dikonfirmasi. Settlement partner kini tersedia.');
}

export function fileDispute(orderId: string, reason: string) {
  if (reason.trim().length < 10) {
    raiseError('dispute-short', 'Ceritakan masalah minimal 10 karakter agar admin bisa menindaklanjuti.', 'Lengkapi kronologi: apa yang dipesan vs yang diterima.');
    return false;
  }
  orders.update((os) =>
    os.map((o) => (o.id === orderId ? { ...o, status: 'disputed', dispute: { reason, status: 'Under Review' } } : o))
  );
  showToast('Komplain terkirim. Admin akan memediasi 1×24 jam.');
  return true;
}

export function productOrError(id: string): MarketProduct {
  const p = productById(id);
  if (!p) {
    raiseError('product-missing', `Produk "${id}" tidak ditemukan di katalog dummy.`, 'Kembali ke katalog — kemungkinan link lama.');
    throw new Error('product-missing');
  }
  return p;
}

// ---------- alur kerja partner & admin (tahap 3) ----------
// New Order → Accepted → Preparing → Ready → Shipped → Delivered → Completed.
// Semua transisi menulis ulang timeline agar tracking customer ikut bergerak.

export const ORDER_FLOW: OrderStatus[] = [
  'pending_payment',
  'paid',
  'accepted',
  'preparing',
  'ready',
  'shipped',
  'delivered',
  'completed',
];

function rebuildTimeline(status: OrderStatus, prev?: Order['timeline']): Order['timeline'] {
  if (status === 'cancelled' || status === 'disputed') return prev ?? [];
  const idx = ORDER_FLOW.indexOf(status);
  return ORDER_FLOW.map((key, i) => ({
    key,
    at: i === idx ? 'baru saja' : i < idx ? (prev?.[i]?.at ?? '—') : '—',
    done: i <= idx,
  }));
}

export function partnerAccept(id: string) {
  orders.update((os) =>
    os.map((o) => (o.id === id && o.status === 'paid' ? { ...o, status: 'accepted', timeline: rebuildTimeline('accepted', o.timeline) } : o))
  );
  showToast('Pesanan diterima. Lanjut ke Preparing.');
}

const NEXT_STEP: Partial<Record<OrderStatus, OrderStatus>> = {
  accepted: 'preparing',
  preparing: 'ready',
  ready: 'shipped',
  shipped: 'delivered',
  delivered: 'completed',
};
export const NEXT_LABEL: Record<string, string> = {
  accepted: 'Mulai Preparing',
  preparing: 'Tandai Ready',
  ready: 'Kirim (Shipped)',
  shipped: 'Tandai Delivered',
  delivered: 'Selesaikan',
};

export function advanceOrder(id: string) {
  orders.update((os) =>
    os.map((o) => {
      const nx = NEXT_STEP[o.status];
      if (o.id !== id || !nx) return o;
      const patch: Partial<Order> = { status: nx, timeline: rebuildTimeline(nx, o.timeline) };
      if (nx === 'completed') patch.settlement = 'available';
      return { ...o, ...patch };
    })
  );
  showToast('Status pesanan diperbarui.');
}

export function cancelOrder(id: string, reason = 'Dibatalkan partner — stok tidak tersedia') {
  orders.update((os) =>
    os.map((o) => (o.id === id ? { ...o, status: 'cancelled', dispute: { reason, status: 'Cancelled' } } : o))
  );
  showToast('Pesanan dibatalkan.');
}

export function withdrawSettlement(partnerId: string) {
  let n = 0;
  orders.update((os) =>
    os.map((o) => {
      if (o.partnerId === partnerId && o.settlement === 'available') {
        n += 1;
        return { ...o, settlement: 'withdrawn' as const };
      }
      return o;
    })
  );
  showToast(n ? `${n} settlement dicairkan (simulasi).` : 'Tidak ada settlement berstatus Available.');
}

export function resolveDispute(id: string, action: 'refund' | 'release' | 'reject') {
  orders.update((os) =>
    os.map((o) => {
      if (o.id !== id) return o;
      if (action === 'refund')
        return { ...o, status: 'cancelled', dispute: { reason: o.dispute?.reason ?? '', status: 'Refunded ke customer' } };
      if (action === 'release')
        return {
          ...o,
          status: 'completed',
          settlement: 'available',
          dispute: { reason: o.dispute?.reason ?? '', status: 'Released ke partner' },
          timeline: o.timeline.map((t) => ({ ...t, done: true })),
        };
      return { ...o, status: 'shipped', dispute: { reason: o.dispute?.reason ?? '', status: 'Ditolak — kembali dikirim' } };
    })
  );
  showToast('Keputusan dispute dicatat (simulasi).');
}
