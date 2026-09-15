// Bungapedia catalog data — rebranded from flowermarketplace.com reconnaissance.
// Images are harvest-local: assets/images/flowermarketplace.com/*

export interface Category {
  id: string;
  name: string;
  detail: string;
  img: string;
  badge?: string;
}

export interface Deal {
  id: string;
  farm: string;
  name: string;
  was: number;
  now: number;
  unit: string;
  img: string;
  tag: string;
}

const IMG = (f: string) => `${import.meta.env.BASE_URL}assets/images/flowermarketplace.com/${f}`;

export const HERO_IMG = IMG('0b5c95843a684c817befc78c95993fc3-1600-93dc4b0060.webp');

export const CATEGORIES: Category[] = [
  {
    id: 'mawar',
    name: 'Mawar',
    detail: '120+ varietas · mulai Rp15rb/ikat',
    img: IMG('33366d30ffbd0b9304731257f074f57d-480-146fdb3e85.webp'),
    badge: 'Terlaris',
  },
  {
    id: 'hortensia',
    name: 'Hortensia',
    detail: '14 warna · mulai Rp28rb/tangkai',
    img: IMG('73e7f8d2edb3395bae17a4be4f8b4975-240-7913d5576d.webp'),
  },
  {
    id: 'tulip',
    name: 'Tulip',
    detail: 'Tunggal & ganda · mulai Rp22rb/ikat',
    img: IMG('7765fbdaac48650bf283a3ff81a126dc-450-a0ccac80a9.webp'),
  },
  {
    id: 'peony',
    name: 'Peony',
    detail: 'Sarah, Coral · mulai Rp45rb/tangkai',
    img: IMG('03c895f62509a1802afade74dde839b2-480-bf5e4a9f9a.webp'),
  },
  {
    id: 'mawar-kebun',
    name: 'Mawar Kebun',
    detail: 'David Austin, Mayra · mulai Rp35rb',
    img: IMG('831fd0b98e08fe217a7e37f4f54c445d-249-e6dc7924b5.webp'),
  },
  {
    id: 'daun',
    name: 'Dedaunan',
    detail: 'Eucalyptus, Ruscus · mulai Rp12rb/ikat',
    img: IMG('9caffa42f100ae8ff1e3d86dc3f07c0a-244-cbc225d9a6.webp'),
  },
  {
    id: 'tropis',
    name: 'Tropis',
    detail: 'Anthurium, jahe · mulai Rp25rb/tangkai',
    img: IMG('8d84fb2861423d27749f14c711d40c4f-480-c7aa10aa9b.webp'),
    badge: 'Lokal',
  },
  {
    id: 'rangkaian',
    name: 'Rangkaian Event',
    detail: 'Dekor pelaminan & meja · mulai Rp1,4jt',
    img: IMG('4142275c5e7d3d072c1283df13388efa-900-cc92a73b92.webp'),
  },
];

export const DEALS: Deal[] = [
  {
    id: 'd1',
    farm: 'Kebun Lembang',
    name: 'MAWAR GARDEN SOUTH PARK',
    was: 1.91,
    now: 1.03,
    unit: '/tangkai',
    img: IMG('2cb852255ecf8884a12469fd1f89eb78-800-9c63fa88d8.webp'),
    tag: '-46%',
  },
  {
    id: 'd2',
    farm: 'Kebun Batu',
    name: 'LILY ORIENTAL PINK',
    was: 24.5,
    now: 18.22,
    unit: '/ikat',
    img: IMG('b7696452f26e685c3a5a8d2ecdfcfb2e-800-161358b056.webp'),
    tag: '-26%',
  },
  {
    id: 'd3',
    farm: 'Kebun Dieng',
    name: 'ALSTROEMERIA PINK',
    was: 9.4,
    now: 6.19,
    unit: '/ikat',
    img: IMG('bc3dff37241196a134e14bc1a6216c62-480-6c122f0e3d.webp'),
    tag: '-34%',
  },
  {
    id: 'd4',
    farm: 'Kebun Dieng',
    name: 'ALSTROEMERIA LAVENDER',
    was: 9.8,
    now: 6.72,
    unit: '/ikat',
    img: IMG('7cd5cea6b34c5a034509dd7b882df5b0-360-6ab53eb502.webp'),
    tag: '-31%',
  },
];

export const PREBOOK = [
  { date: 'SEP 2026', title: 'Puncak Musim Kawin', note: 'Pre-book tutup 25 Agu', hot: true },
  { date: 'OKT 2026', title: 'Sumpah Pemuda & Halloween', note: 'Deadline 25 Sep', hot: false },
  { date: 'DES 2026', title: 'Natal & Tahun Baru', note: 'Deadline 25 Nov', hot: false },
  { date: 'FEB 2027', title: 'Valentine', note: 'Deadline 20 Jan', hot: true },
  { date: 'MAR 2027', title: 'Awal Musim Hajatan', note: 'Deadline 25 Feb', hot: false },
  { date: 'MEI 2027', title: 'Hari Ibu', note: 'Deadline 10 Apr', hot: false },
];

export const PRESS = ['The Knot', 'People', 'Engage!', 'Munaichi', 'PartySlate', 'Preston Bailey'];

export const NAV_LINKS = [
  { label: 'Stok', href: '#/stok' },
  { label: 'Prebook', href: '#/prebook' },
  { label: 'Perpustakaan Bunga', href: '#/library' },
  { label: 'Blog', href: '#/blog' },
  { label: 'Tentang', href: '#/about' },
];

export const SUBNAV = [
  { label: 'Stok Live', href: '#/stok' },
  { label: 'Prebook', href: '#/prebook' },
  { label: 'Perpustakaan Bunga', href: '#/library' },
  { label: 'Blog', href: '#/blog' },
  { label: 'Tentang', href: '#/about' },
];

export function rp(n: number): string {
  return 'Rp' + n.toLocaleString('id-ID', { maximumFractionDigits: 0 });
}

// ---------- Katalog Stok Live (meniru halaman product-listing ori) ----------
export interface Product {
  id: string;
  name: string;
  cat: string;
  color: string;
  market: string;
  price: number;
  was?: number;
  unit: 'ikat' | 'tangkai';
  stock: number;
  step: number;
  img: string;
  sale?: string;
}

export const PRODUCTS: Product[] = [
  { id: 'p01', name: 'MAWAR FREEDOM MERAH', cat: 'Mawar', color: 'Merah', market: 'Bandung', price: 185000, unit: 'ikat', stock: 24, step: 1, img: IMG('33366d30ffbd0b9304731257f074f57d-480-146fdb3e85.webp') },
  { id: 'p02', name: 'GARDEN ROSE JULIET PEACH', cat: 'Mawar Kebun', color: 'Peach', market: 'Bandung', price: 320000, was: 395000, unit: 'ikat', stock: 9, step: 1, img: IMG('831fd0b98e08fe217a7e37f4f54c445d-249-e6dc7924b5.webp'), sale: '-19%' },
  { id: 'p03', name: 'GARDEN ROSE SOUTH PARK', cat: 'Mawar Kebun', color: 'Pink', market: 'Bandung', price: 165000, was: 305000, unit: 'ikat', stock: 14, step: 1, img: IMG('2cb852255ecf8884a12469fd1f89eb78-800-9c63fa88d8.webp'), sale: '-46%' },
  { id: 'p04', name: 'HORTENSIA PUTIH', cat: 'Hortensia', color: 'Putih', market: 'Batu', price: 28000, unit: 'tangkai', stock: 120, step: 10, img: IMG('73e7f8d2edb3395bae17a4be4f8b4975-240-7913d5576d.webp') },
  { id: 'p05', name: 'TULIP DOUBLE PINK', cat: 'Tulip', color: 'Pink', market: 'Impor', price: 225000, unit: 'ikat', stock: 31, step: 1, img: IMG('7765fbdaac48650bf283a3ff81a126dc-450-a0ccac80a9.webp') },
  { id: 'p06', name: 'PEONY SARAH BERNHARDT', cat: 'Peony', color: 'Pink', market: 'Impor', price: 45000, was: 62000, unit: 'tangkai', stock: 60, step: 10, img: IMG('03c895f62509a1802afade74dde839b2-480-bf5e4a9f9a.webp'), sale: '-27%' },
  { id: 'p07', name: 'EUCALYPTUS SILVER DOLLAR', cat: 'Dedaunan', color: 'Hijau', market: 'Dieng', price: 95000, unit: 'ikat', stock: 48, step: 1, img: IMG('9caffa42f100ae8ff1e3d86dc3f07c0a-244-cbc225d9a6.webp') },
  { id: 'p08', name: 'ANTHURIUM MERAH', cat: 'Tropis', color: 'Merah', market: 'Bali', price: 25000, unit: 'tangkai', stock: 200, step: 25, img: IMG('8d84fb2861423d27749f14c711d40c4f-480-c7aa10aa9b.webp') },
  { id: 'p09', name: 'LILY ORIENTAL PINK', cat: 'Lily', color: 'Pink', market: 'Batu', price: 290000, was: 390000, unit: 'ikat', stock: 17, step: 1, img: IMG('b7696452f26e685c3a5a8d2ecdfcfb2e-800-161358b056.webp'), sale: '-26%' },
  { id: 'p10', name: 'ALSTROEMERIA PINK', cat: 'Alstroemeria', color: 'Pink', market: 'Dieng', price: 99000, was: 150000, unit: 'ikat', stock: 22, step: 1, img: IMG('bc3dff37241196a134e14bc1a6216c62-480-6c122f0e3d.webp'), sale: '-34%' },
  { id: 'p11', name: 'ALSTROEMERIA LAVENDER', cat: 'Alstroemeria', color: 'Lavender', market: 'Dieng', price: 107000, was: 156000, unit: 'ikat', stock: 19, step: 1, img: IMG('7cd5cea6b34c5a034509dd7b882df5b0-360-6ab53eb502.webp'), sale: '-31%' },
  { id: 'p12', name: 'PAKET DEKOR PELAMINAN', cat: 'Box Kombo', color: 'Campur', market: 'Bandung', price: 1450000, unit: 'ikat', stock: 6, step: 1, img: IMG('4142275c5e7d3d072c1283df13388efa-900-cc92a73b92.webp') },
];

export const SHIP_METHODS = ['Same-Day Jabodetabek', 'Overnight Prioritas', 'Kargo Ekonomi', 'Ambil di Hub'];

// ---------- Blog & Perpustakaan ----------
export interface Post {
  id: string;
  cat: string;
  title: string;
  excerpt: string;
  date: string;
  img: string;
}

export const POSTS: Post[] = [
  {
    id: 'b1', cat: 'Panduan', title: 'Cara membaca grade mawar grosir: A, B, dan Super',
    excerpt: 'Panjang tangkai, diameter kuntum & keseragaman — tiga angka yang menentukan harga per ikat.',
    date: '8 Sep 2026', img: IMG('33366d30ffbd0b9304731257f074f57d-480-146fdb3e85.webp'),
  },
  {
    id: 'b2', cat: 'Event', title: 'Timeline 21 hari menyiapkan bunga wedding 500 tamu',
    excerpt: 'Dari pre-book, color story, sampai cadangan substitusi yang pre-approved klien.',
    date: '28 Agu 2026', img: IMG('4142275c5e7d3d072c1283df13388efa-900-cc92a73b92.webp'),
  },
  {
    id: 'b3', cat: 'Perawatan', title: 'Rantai dingin rumahan: membuat peony impor tahan 9 hari',
    excerpt: 'Suhu air, potong ulang 45°, dan food packet — protokol hub kami yang bisa ditiru di toko.',
    date: '15 Agu 2026', img: IMG('03c895f62509a1802afade74dde839b2-480-bf5e4a9f9a.webp'),
  },
];

export interface LibEntry {
  name: string;
  latin: string;
  vaseLife: string;
  note: string;
  img: string;
}

export const LIBRARY: LibEntry[] = [
  { name: 'Mawar', latin: 'Rosa hybrida', vaseLife: '7–10 hari', note: 'Buang duri bawah garis air, potong ulang tiap 2 hari.', img: IMG('33366d30ffbd0b9304731257f074f57d-480-146fdb3e85.webp') },
  { name: 'Hortensia', latin: 'Hydrangea macrophylla', vaseLife: '5–8 hari', note: 'Sangat haus — rendam kuntum 30 menit bila layu.', img: IMG('73e7f8d2edb3395bae17a4be4f8b4975-240-7913d5576d.webp') },
  { name: 'Tulip', latin: 'Tulipa gesneriana', vaseLife: '5–7 hari', note: 'Terus tumbuh di vas — sisakan ruang 5 cm.', img: IMG('7765fbdaac48650bf283a3ff81a126dc-450-a0ccac80a9.webp') },
  { name: 'Peony', latin: 'Paeonia lactiflora', vaseLife: '7–9 hari', note: 'Beli saat marshmallow stage untuk mekar tepat waktu.', img: IMG('03c895f62509a1802afade74dde839b2-480-bf5e4a9f9a.webp') },
  { name: 'Lily Oriental', latin: 'Lilium orientalis', vaseLife: '10–14 hari', note: 'Cabut anter serbuk sari agar tidak menodai kelopak.', img: IMG('b7696452f26e685c3a5a8d2ecdfcfb2e-800-161358b056.webp') },
  { name: 'Alstroemeria', latin: 'Alstroemeria aurea', vaseLife: '10–14 hari', note: 'Cabut daun bawah, ganti air tiap 3 hari.', img: IMG('bc3dff37241196a134e14bc1a6216c62-480-6c122f0e3d.webp') },
];
