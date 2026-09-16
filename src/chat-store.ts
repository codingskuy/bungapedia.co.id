// Lapisan percakapan Bungapedia — mediasi terikat konteks transaksi.
// ATURAN: customer dan partner TIDAK bisa chat langsung satu sama lain.
// Semua percakapan lewat admin sebagai mediator:
//   - admin-customer   : bantuan transaksi / mediasi komplain
//   - admin-partner    : konfirmasi operasional
// Bukan chat realtime: persist localStorage + "balasan simulasi" berlabel jujur.

import { writable } from 'svelte/store';
import { partnerById } from './market-data';
import type { Order } from './market-types';

export type ChatRole = 'customer' | 'partner' | 'admin';
export type ThreadKind = 'admin-customer' | 'admin-partner';

export interface Me {
  role: ChatRole;
  id?: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  from: ChatRole;
  name: string;
  text: string;
  at: string;
  sim?: boolean;
}

export interface Thread {
  id: string;
  kind: ThreadKind;
  title: string;
  orderId?: string;
  customerId?: string;
  customerName?: string;
  partnerId?: string;
  partnerName?: string;
  messages: ChatMessage[];
  unread: Record<ChatRole, number>;
  updatedAt: string;
}

const KIND_LABEL: Record<ThreadKind, string> = {
  'admin-customer': 'Admin × Customer',
  'admin-partner': 'Admin × Partner',
};
export const kindLabel = (k: ThreadKind): string => KIND_LABEL[k];

function stamp(): string {
  return new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function blankUnread(): Record<ChatRole, number> {
  return { customer: 0, partner: 0, admin: 0 };
}
function msg(from: ChatRole, name: string, text: string, at = stamp(), sim = false): ChatMessage {
  return { id: `m-${Date.now().toString(36)}-${Math.floor(Math.random() * 9999)}`, from, name, text, at, sim };
}

function seed(): Thread[] {
  return [
    {
      id: 't-dispute-009',
      kind: 'admin-customer',
      title: 'INV-2026-009 · Standing Flower Juliet Peach',
      orderId: 'INV-2026-009',
      customerId: 'c-budi',
      customerName: 'Budi',
      messages: [
        msg('customer', 'Budi', 'Halo admin, warna yang datang pink, padahal saya pesan Juliet Peach. Ada foto QC-nya?', '6 Sep 2026 · 14:02'),
        msg('admin', 'Admin Bungapedia', 'Mohon maaf atas ketidaknyamanannya, Pak Budi. Bisa lampirkan foto produk yang diterima di sini? Kami mediasi ke Flower House 1×24 jam.', '6 Sep 2026 · 14:20'),
      ],
      unread: { customer: 1, partner: 0, admin: 0 },
      updatedAt: '6 Sep 2026 · 14:20',
    },
    {
      id: 't-ops-002',
      kind: 'admin-partner',
      title: 'INV-2026-002 · Bunga Papan Grand Opening ×2',
      orderId: 'INV-2026-002',
      customerId: 'c-budi',
      customerName: 'Budi',
      partnerId: 'pt-bunga-sejahtera',
      partnerName: 'Bunga Sejahtera',
      messages: [
        msg('partner', 'Bunga Sejahtera', '2 papan grand opening selesai, foto QC terlampir. Armada berangkat 07:30 agar tiba sebelum jam 10.', '12 Sep 2026 · 18:05'),
        msg('admin', 'Admin Bungapedia', 'Diterima. Kabari saat armada tiba di lokasi ya.', '12 Sep 2026 · 18:12'),
      ],
      unread: { customer: 0, partner: 1, admin: 0 },
      updatedAt: '12 Sep 2026 · 18:12',
    },
  ];
}

const VALID_KINDS: ThreadKind[] = ['admin-customer', 'admin-partner'];

function restore(): Thread[] {
  try {
    const raw = localStorage.getItem('bp-threads');
    if (!raw) return seed();
    const v = JSON.parse(raw) as Thread[];
    // Migrasi: buang thread customer-partner lawas (jalur itu sudah ditutup).
    const kept = Array.isArray(v) ? v.filter((t) => VALID_KINDS.includes(t.kind)) : [];
    return kept.length ? kept : seed();
  } catch {
    return seed();
  }
}

export const threads = writable<Thread[]>(typeof localStorage !== 'undefined' ? restore() : seed());
threads.subscribe((v) => {
  try {
    localStorage.setItem('bp-threads', JSON.stringify(v));
  } catch {
    /* abaikan */
  }
});

function get(id: string): Thread | undefined {
  let found: Thread | undefined;
  threads.subscribe((ts) => {
    found = ts.find((t) => t.id === id);
  })();
  return found;
}

/** Thread yang boleh dilihat pemilik sesi. */
export function visibleThreads(me: Me): Thread[] {
  let all: Thread[] = [];
  threads.subscribe((ts) => (all = ts.filter((t) => VALID_KINDS.includes(t.kind))))();
  if (me.role === 'admin') return [...all].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  if (me.role === 'customer')
    return all
      .filter((t) => t.customerId === me.id || t.customerName === me.name)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return all.filter((t) => t.partnerId === me.id).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function totalUnread(me: Me): number {
  return visibleThreads(me).reduce((n, t) => n + (t.unread[me.role] ?? 0), 0);
}

/**
 * Buka (atau buat) thread untuk sebuah order. Customer & partner selalu
 * diarahkan ke admin — tidak ada jalur langsung customer↔partner.
 * - customer → admin  : mediasi / bantuan transaksi
 * - partner → admin   : konfirmasi operasional
 * - admin → customer/partner: dijangkau dari detail transaksi
 */
export function ensureOrderThread(order: Order, target: 'admin' | 'partner' | 'customer', me: Me): string {
  let kind: ThreadKind;
  if (me.role === 'customer') kind = 'admin-customer';
  else if (me.role === 'partner') kind = 'admin-partner';
  else kind = target === 'partner' ? 'admin-partner' : 'admin-customer';

  let existing: Thread | undefined;
  threads.subscribe((ts) => {
    existing = ts.find((t) => t.orderId === order.id && t.kind === kind);
  })();
  if (existing) return existing.id;

  const id = `t-${Date.now().toString(36)}`;
  let partnerName: string | undefined;
  try {
    partnerName = partnerById(order.partnerId)?.name;
  } catch {
    partnerName = undefined;
  }
  const thread: Thread = {
    id,
    kind,
    title: `${order.id} · ${order.items[0]?.name ?? 'Pesanan'}`,
    orderId: order.id,
    customerId: me.role === 'customer' ? me.id : order.customerId,
    customerName: me.role === 'customer' ? me.name : order.customerName,
    partnerId: order.partnerId,
    partnerName,
    messages: [],
    unread: blankUnread(),
    updatedAt: stamp(),
  };
  threads.update((ts) => [thread, ...ts]);
  return id;
}

/** Nama partner untuk tampilan bila thread dibuat tanpa nama (diisi malas dari data). */
export function fillPartnerName(threadId: string, name: string) {
  threads.update((ts) => ts.map((t) => (t.id === threadId && !t.partnerName ? { ...t, partnerName: name } : t)));
}

export function send(threadId: string, me: Me, text: string): { ok: boolean; error?: string } {
  const clean = text.trim();
  if (!clean) return { ok: false, error: 'Pesan kosong — tulis dulu 1 kalimat.' };
  if (clean.length > 500) return { ok: false, error: 'Maksimal 500 karakter agar tetap ringkas.' };
  const t = get(threadId);
  if (!t) return { ok: false, error: 'Thread tidak ditemukan.' };
  const [a, b] = t.kind.split('-') as [ChatRole, ChatRole];
  const other: ChatRole = me.role === a ? b : a;
  threads.update((ts) =>
    ts.map((x) =>
      x.id === threadId
        ? { ...x, messages: [...x.messages, msg(me.role, me.name, clean)], unread: { ...x.unread, [other]: (x.unread[other] ?? 0) + 1 }, updatedAt: stamp() }
        : x
    )
  );
  return { ok: true };
}

export function markRead(threadId: string, role: ChatRole) {
  threads.update((ts) => ts.map((x) => (x.id === threadId ? { ...x, unread: { ...x.unread, [role]: 0 } } : x)));
}

const CANNED: Record<ChatRole, string[]> = {
  customer: ['Baik, terima kasih infonya! Ditunggu kabar selanjutnya.'],
  partner: ['Siap! Pesanan sedang kami kerjakan, foto QC menyusul sebelum kirim.'],
  admin: ['Terima kasih laporannya. Kami catat dan tindak lanjuti 1×24 jam.'],
};

/** Balasan simulasi yang JUJUR diberi label — untuk demo alur tanpa menunggu manusia. */
export function simulateReply(threadId: string, me: Me): boolean {
  const t = get(threadId);
  if (!t) return false;
  const other: ChatRole = t.kind.startsWith(me.role) ? (t.kind.split('-')[1] as ChatRole) : (t.kind.split('-')[0] as ChatRole);
  const name = other === 'admin' ? 'Admin Bungapedia' : other === 'partner' ? (t.partnerName ?? 'Partner') : (t.customerName ?? 'Customer');
  const pool = CANNED[other];
  const text = `[Simulasi] ${pool[Math.floor(Math.random() * pool.length)]}`;
  threads.update((ts) =>
    ts.map((x) =>
      x.id === threadId
        ? { ...x, messages: [...x.messages, msg(other, name, text, stamp(), true)], unread: { ...x.unread, [me.role]: (x.unread[me.role] ?? 0) + 1 }, updatedAt: stamp() }
        : x
    )
  );
  return true;
}
