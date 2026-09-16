# Bungapedia — Brand Identity Directions

Sumber mark resmi: `public/assets/brand/bungapedia-mark.png` (dari `image.png` milik owner).
Sumber lockup resmi: `public/assets/brand/bungapedia-lockup.png` (dari
`logo-removebg-preview.png` milik owner — **transparan**, revisi dari
`logo.jpeg`) — wordmark "Bungapedia" (Bunga koral + pedia hijau, bunga di
huruf B) + tagline baked-in **"Small Gifts, Meaningful Bonds"**.
Favicon aktif: `public/favicon.png` (mark B-daun — lockup terlalu lebar untuk favicon).

## Anatomi mark
Monogram huruf **"B"** yang dibentuk dari **helai daun** — sisi kiri rumpun daun
menyirip, sisi kanan goresan "B" tegas. Gradasi hijau muda → hijau hutan.
Makna: **B**ungapedia = **B**unga + pengetahuan/kepercayaan ("pedia").
Bentuknya sudah final milik owner — jangan digambar ulang, jangan ditiru mirip.

## Palet (disampel dari mark, OKLch)
| Token | Nilai | Pakai |
|---|---|---|
| `--brand-leaf` | `#8bc34a` (oklch(0.79 0.15 128)) | highlight, badge cerah |
| `--brand-mid` | `#69a63c` = `--accent` eksisting | CTA primer, elemen interaktif |
| `--brand-shadow` | `#4f7f2b` = `--accent-dark` eksisting | hover, teks aksen |
| `--brand-deep` | `#1e5c22` (oklch(0.42 0.11 145)) | footer band, teks di atas terang |
| `--brand-soft` | `#eef5e6` = `--accent-soft` eksisting | latar badge Verified, info box |

Palet UI eksisting **sudah selaras** dengan mark — tidak ada token yang diganti,
hanya `--brand-leaf` dan `--brand-deep` ditambahkan sebagai perluasan resmi.

## Rute lockup (sudah dipasang di 3 portal)
- **A — Primary (dipakai):** file `bungapedia-lockup.png` UTUH sebagai
  satu-satunya lockup — header 48px dan footer 56px, langsung di atas
  permukaan (putih/gelap) tanpa blend dan tanpa pelat, karena background-nya
  sudah transparan. Teks + tagline HTML tidak dipakai di   sebelah logo. Tagline situs ("Hantarkan Apresiasi…") tetap hidup di
  copy homepage/About, sementara lockup membawa tagline Inggris-nya sendiri.
- **B — App-icon (dipakai):** mark rounded-10px di atas putih (header) dan
  di atas hijau tua (footer). Favicon memakai file yang sama.
- **C — Wordmark saja (cadangan):** teks "Bungapedia" serif tanpa mark —
  untuk konteks sempit (email subject, invoice print). Belum diimplementasikan.

## Aturan pakai
1. Mark tidak boleh di-stretch, di-rotate, diberi shadow/drop-effect, atau
   ditimpa teks.
2. Jangan menaruh mark di atas foto ramai tanpa scrim — pakai versi app-icon
   (kotak putih rounded) bila background tidak polos.
3. Ukuran minimum: 24px digital / 8mm cetak. Di bawah itu pakai wordmark saja.
4. Clearspace: setara tinggi 1 helai daun di semua sisi (praktis: padding
   25% dari lebar mark).
5. Warna CTA tetap satu aksen (`--accent`); hijau lain hanya untuk merek,
   bukan untuk tombol tambahan.
6. Dilarang membuat "logo baru mirip B-daun" untuk sub-brand — sub-brand
   memakai wordmark + label teks (cth. "Bungapedia · Portal Partner").

## Prompt generasi aset turunan (bila perlu via imagegen)
- **OG/social card:** "Wide 1200×630 brand card, deep forest green (#1e5c22)
  background, the green leaf-letter-B mark large on the left, cream serif
  headline 'Hantarkan Apresiasi, Satukan Kebersamaan', small white
  'bungapedia.co.id', flat vector style, no photo, no extra flowers"
- **Pattern dekoratif:** "Seamless subtle pattern of single leaf sprigs in
  muted sage on cream (#faf8f3), flat, low contrast, stationery texture"
- **Avatar partner default:** "Round avatar placeholder, soft sage background,
  single minimalist leaf sprig line icon in deep green, flat, no face, no text"
- **Jangan generate:** logo baru, variasi mark, maskot, atau ilustrasi
  "toko bunga" generik untuk menggantikan foto produk asli.
