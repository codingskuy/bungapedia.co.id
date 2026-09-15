// Ops store — sisi Partner & Admin. Persisted overrides di atas seed market-data,
// sehingga aksi demo (verifikasi, suspend, CRUD produk) terasa nyata dan tidak 404.

import { derived, writable } from 'svelte/store';
import { PARTNERS, PRODUCTS } from './market-data';
import type { MarketProduct } from './market-types';
import { orders, showToast } from './market-store';

function restore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function persist<T>(key: string, store: { subscribe: (fn: (v: T) => void) => unknown }) {
  store.subscribe((v) => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* abaikan — state tetap jalan di memori */
    }
  });
}

// ---------- flags partner (verifikasi & suspensi live) ----------
export interface PartnerFlag {
  verified: boolean;
  suspended: boolean;
}
const seedFlags = (): Record<string, PartnerFlag> =>
  Object.fromEntries(PARTNERS.map((p) => [p.id, { verified: p.verified, suspended: false }]));
export const partnerFlags = writable<Record<string, PartnerFlag>>(restore('bp-flags', seedFlags()));
persist('bp-flags', partnerFlags);

export function flagOf(id: string): PartnerFlag {
  let f: PartnerFlag = { verified: false, suspended: false };
  partnerFlags.subscribe((m) => {
    f = m[id] ?? f;
  })();
  return f;
}
export function setVerified(id: string, v: boolean) {
  partnerFlags.update((m) => ({ ...m, [id]: { ...(m[id] ?? { verified: false, suspended: false }), verified: v } }));
  showToast(v ? 'Partner diverifikasi (simulasi).' : 'Verifikasi partner dicabut.');
}
export function setSuspended(id: string, s: boolean) {
  partnerFlags.update((m) => ({ ...m, [id]: { ...(m[id] ?? { verified: true, suspended: false }), suspended: s } }));
  showToast(s ? 'Partner di-suspend. Produknya disembunyikan dari katalog.' : 'Suspensi dicabut.');
}
export function resetOps() {
  partnerFlags.set(seedFlags());
  catalog.set(PRODUCTS);
  showToast('Demo ops di-reset ke seed awal.');
}

// ---------- katalog live (CRUD partner menembus ke katalog customer) ----------
export const catalog = writable<MarketProduct[]>(restore('bp-catalog', PRODUCTS));
persist('bp-catalog', catalog);

export function upsertProduct(p: MarketProduct) {
  catalog.update((cs) => {
    const i = cs.findIndex((x) => x.id === p.id);
    if (i >= 0) {
      const next = [...cs];
      next[i] = p;
      return next;
    }
    return [p, ...cs];
  });
  showToast('Produk disimpan & langsung tampil di katalog.');
}
export function removeProduct(id: string) {
  catalog.update((cs) => cs.filter((x) => x.id !== id));
  showToast('Produk dihapus dari katalog (simulasi).');
}
export function toggleAvailable(id: string) {
  catalog.update((cs) => cs.map((x) => (x.id === id ? { ...x, available: !x.available } : x)));
}

// ---------- angka bisnis (satu sumber kebenaran dari orders) ----------
export const netOf = (productTotal: number): number => Math.round(productTotal * 0.9);

export const adminStats = derived(orders, ($os) => {
  const live = $os.filter((o) => o.status !== 'cancelled');
  const paid = live.filter((o) => o.paymentStatus === 'paid');
  return {
    gmv: paid.reduce((n, o) => n + o.total, 0),
    revenue: paid.reduce((n, o) => n + o.platformFee, 0),
    orders: $os.length,
    active: $os.filter((o) => !['completed', 'cancelled'].includes(o.status)).length,
    pendingSettlement: paid.filter((o) => o.settlement === 'pending').reduce((n, o) => n + netOf(o.productTotal), 0),
    disputes: $os.filter((o) => o.status === 'disputed').length,
  };
});

export function partnerKpis(pid: string) {
  return derived(orders, ($os) => {
    const mine = $os.filter((o) => o.partnerId === pid);
    const paid = mine.filter((o) => o.paymentStatus === 'paid' && o.status !== 'cancelled');
    return {
      fresh: mine.filter((o) => o.status === 'paid').length,
      active: mine.filter((o) => ['accepted', 'preparing', 'ready', 'shipped'].includes(o.status)).length,
      done: mine.filter((o) => o.status === 'completed').length,
      revenue: paid.reduce((n, o) => n + o.productTotal, 0),
      fee: paid.reduce((n, o) => n + Math.round(o.productTotal * 0.1), 0),
      pending: mine.filter((o) => o.settlement === 'pending' && o.paymentStatus === 'paid').reduce((n, o) => n + netOf(o.productTotal), 0),
      available: mine.filter((o) => o.settlement === 'available').reduce((n, o) => n + netOf(o.productTotal), 0),
      withdrawn: mine.filter((o) => o.settlement === 'withdrawn').reduce((n, o) => n + netOf(o.productTotal), 0),
    };
  });
}
