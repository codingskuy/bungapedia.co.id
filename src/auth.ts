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
  const clean = email.trim().toLowerCase();
  const acc =
    ACCOUNTS[role].find((a) => a.email.toLowerCase() === clean) ??
    (role === 'customer' ? getExtraUsers().find((a) => a.email.toLowerCase() === clean) : undefined);
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

// ---------- registrasi customer via email + OTP (simulasi — tanpa backend email) ----------
// Produksi: OTP dikirim via email/SMS oleh provider. Prototype: kode DITAMPILKAN
// di layar sebagai "kode demo" agar alur bisa didemo end-to-end secara jujur.

export interface RegisteredCustomer extends DemoAccount {
  customerId: string;
}
export interface PendingReg {
  name: string;
  email: string;
  pass: string;
  otp: string;
  expiresAt: number;
  attempts: number;
}

const EXTRA_KEY = 'bp-users-extra';
const PENDING_KEY = 'bp-reg-pending';
export const OTP_TTL_MS = 5 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* abaikan */
  }
}

export function getExtraUsers(): RegisteredCustomer[] {
  return typeof localStorage === 'undefined' ? [] : readJSON<RegisteredCustomer[]>(EXTRA_KEY, []);
}
function getPending(): PendingReg | null {
  return typeof localStorage === 'undefined' ? null : readJSON<PendingReg | null>(PENDING_KEY, null);
}
const emailTaken = (email: string): boolean =>
  CUSTOMER_ACCOUNTS.some((a) => a.email.toLowerCase() === email) ||
  getExtraUsers().some((a) => a.email.toLowerCase() === email);

const makeOtp = (): string => String(Math.floor(100000 + Math.random() * 900000));

export function requestOtp(name: string, email: string, pass: string): { ok: boolean; otp?: string; error?: string } {
  const clean = email.trim().toLowerCase();
  if (name.trim().length < 3) return { ok: false, error: 'Nama minimal 3 karakter.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return { ok: false, error: 'Email tidak valid.' };
  if (pass.length < 6) return { ok: false, error: 'Password minimal 6 karakter.' };
  if (emailTaken(clean)) return { ok: false, error: 'Email sudah terdaftar. Langsung masuk saja.' };
  const pending: PendingReg = { name: name.trim(), email: clean, pass, otp: makeOtp(), expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 };
  writeJSON(PENDING_KEY, pending);
  return { ok: true, otp: pending.otp };
}

export function resendOtp(): { ok: boolean; otp?: string; error?: string } {
  const p = getPending();
  if (!p) return { ok: false, error: 'Tidak ada pendaftaran berjalan. Ulangi dari formulir.' };
  const next: PendingReg = { ...p, otp: makeOtp(), expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 };
  writeJSON(PENDING_KEY, next);
  return { ok: true, otp: next.otp };
}

export function pendingInfo(): PendingReg | null {
  const p = getPending();
  if (!p) return null;
  if (Date.now() > p.expiresAt) {
    try {
      localStorage.removeItem(PENDING_KEY);
    } catch {
      /* abaikan */
    }
    return null;
  }
  return p;
}

export function verifyOtp(code: string): { ok: boolean; remaining?: number; error?: string } {
  const p = getPending();
  if (!p) return { ok: false, error: 'Kode kedaluwarsa atau tidak ada pendaftaran. Minta kode baru.' };
  if (Date.now() > p.expiresAt) {
    try {
      localStorage.removeItem(PENDING_KEY);
    } catch {
      /* abaikan */
    }
    return { ok: false, error: 'Kode kedaluwarsa (5 menit). Minta kode baru.' };
  }
  if (p.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, error: 'Terlalu banyak percobaan. Minta kode baru.' };
  if (code.trim() !== p.otp) {
    const attempts = p.attempts + 1;
    writeJSON(PENDING_KEY, { ...p, attempts });
    return { ok: false, remaining: OTP_MAX_ATTEMPTS - attempts, error: 'Kode salah. Periksa 6 digit di kotak demo.' };
  }
  const user: RegisteredCustomer = {
    email: p.email,
    pass: p.pass,
    name: p.name,
    customerId: `c-reg-${Date.now().toString(36)}`,
  };
  writeJSON(EXTRA_KEY, [...getExtraUsers(), user]);
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    /* abaikan */
  }
  sessionCustomer.set({ role: 'customer', name: user.name, email: user.email, customerId: user.customerId });
  return { ok: true };
}

export function cancelRegistration() {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    /* abaikan */
  }
}
