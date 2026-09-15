// Auth prototype — 3 konteks terpisah, masing-masing login dummy sendiri.
// Customer  : rina@demo.id / budi@demo.id / sinta@demo.id (pass: demo123)
// Partner   : satu akun per partner, mis. flowerhouse@demo.id (pass: demo123)
// Admin     : owner@bungapedia.id / ops@bungapedia.id (pass: demo123)
// Sesi disimpan per konteks (bp-auth-*) agar login di satu entry tidak bocor ke lainnya.

import { writable } from 'svelte/store';
import { CUSTOMERS, PARTNERS } from './market-data';

export type Role = 'customer' | 'partner' | 'admin';

export interface Session {
  role: Role;
  name: string;
  email: string;
  customerId?: string;
  partnerId?: string;
}

export interface DemoAccount {
  email: string;
  pass: string;
  name: string;
  customerId?: string;
  partnerId?: string;
}

const PASS = 'demo123';

export const CUSTOMER_ACCOUNTS: DemoAccount[] = CUSTOMERS.map((c) => ({
  email: `${c.name.toLowerCase()}@demo.id`,
  pass: PASS,
  name: c.name,
  customerId: c.id,
}));

const PARTNER_EMAILS: Record<string, string> = {
  'pt-bunga-sejahtera': 'sejahtera@demo.id',
  'pt-flower-house': 'flowerhouse@demo.id',
  'pt-kebun-dieng': 'dieng@demo.id',
  'pt-bali-tropis': 'bali@demo.id',
  'pt-hampers-kita': 'hampers@demo.id',
};

export const PARTNER_ACCOUNTS: DemoAccount[] = PARTNERS.map((p) => ({
  email: PARTNER_EMAILS[p.id] ?? `${p.id}@demo.id`,
  pass: PASS,
  name: p.name,
  partnerId: p.id,
}));

export const ADMIN_ACCOUNTS: DemoAccount[] = [
  { email: 'owner@bungapedia.id', pass: PASS, name: 'Owner' },
  { email: 'ops@bungapedia.id', pass: PASS, name: 'Ops Support' },
];

const ACCOUNTS: Record<Role, DemoAccount[]> = {
  customer: CUSTOMER_ACCOUNTS,
  partner: PARTNER_ACCOUNTS,
  admin: ADMIN_ACCOUNTS,
};

const KEYS: Record<Role, string> = {
  customer: 'bp-auth-customer',
  partner: 'bp-auth-partner',
  admin: 'bp-auth-admin',
};

function load(role: Role): Session | null {
  try {
    const raw = localStorage.getItem(KEYS[role]);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    return s && s.role === role ? s : null;
  } catch {
    return null;
  }
}

function makeSession(role: Role) {
  const store = writable<Session | null>(typeof localStorage !== 'undefined' ? load(role) : null);
  store.subscribe((s) => {
    try {
      if (s) localStorage.setItem(KEYS[role], JSON.stringify(s));
      else localStorage.removeItem(KEYS[role]);
    } catch {
      /* abaikan */
    }
  });
  return store;
}

export const sessionCustomer = makeSession('customer');
export const sessionPartner = makeSession('partner');
export const sessionAdmin = makeSession('admin');

export function login(role: Role, email: string, pass: string): { ok: boolean; error?: string } {
  const acc = ACCOUNTS[role].find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!acc) return { ok: false, error: `Email tidak terdaftar untuk portal ini. Gunakan salah satu akun demo di bawah.` };
  if (acc.pass !== pass) return { ok: false, error: 'Password salah. Password semua akun demo: demo123.' };
  const session: Session = { role, name: acc.name, email: acc.email, customerId: acc.customerId, partnerId: acc.partnerId };
  if (role === 'customer') sessionCustomer.set(session);
  else if (role === 'partner') sessionPartner.set(session);
  else sessionAdmin.set(session);
  return { ok: true };
}

export function logout(role: Role) {
  if (role === 'customer') sessionCustomer.set(null);
  else if (role === 'partner') sessionPartner.set(null);
  else sessionAdmin.set(null);
}

/** Customer yang sedang login (untuk menandai pesanan baru). */
export function currentCustomer(): { customerId: string; name: string } | null {
  let s: Session | null = null;
  sessionCustomer.subscribe((v) => (s = v))();
  return s ? { customerId: s.customerId ?? 'c-guest', name: s.name } : null;
}
