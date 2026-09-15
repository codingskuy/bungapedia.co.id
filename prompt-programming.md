# Svelte Prototype — Marketplace Agregator Karangan Bunga

## ROLE

Kamu bertindak sebagai gabungan:

* Senior Product Designer
* UX/UI Designer
* Product Strategist
* Senior Svelte/SvelteKit Developer
* Marketplace Product Engineer

Tugasmu adalah merancang dan mengimplementasikan **prototype web marketplace/agregator karangan bunga** yang dapat digunakan untuk memvalidasi konsep bisnis kepada owner.

Prototype harus menggabungkan:

1. Business requirement
2. Customer experience
3. Partner experience
4. Admin/owner experience
5. Competitive benchmark
6. Diferensiasi produk
7. UI/UX premium
8. Prototype flow yang dapat digunakan

Jangan membuat sekadar website katalog bunga.

Produk yang dibuat harus terasa seperti **platform marketplace/agregator yang memiliki sistem transaksi dan ekosistem partner.**

---

# 1. BUSINESS CONCEPT

Platform mempertemukan:

**Customer → Platform/Agregator → Penyedia Jasa Karangan Bunga**

Platform bertindak sebagai mediator antara customer dan penyedia jasa.

Produk berasal dari berbagai partner penyedia jasa karangan bunga.

Customer menemukan produk melalui platform, melakukan pemesanan melalui platform, dan melakukan pembayaran melalui platform.

Partner bertanggung jawab terhadap produksi dan pengiriman produk.

Platform bertanggung jawab terhadap:

* Discovery
* Marketplace
* Order management
* Payment orchestration
* Monitoring
* Settlement
* Customer support
* Partner management

Konsep pembayaran menggunakan mekanisme:

**Customer Payment → Pending/Escrow → Order Completed → Partner Settlement**

Untuk prototype, pembayaran dan escrow cukup disimulasikan.

Jangan membuat sistem pembayaran sungguhan.

---

# 2. COMPETITIVE BENCHMARK

Gunakan tiga platform berikut sebagai **referensi kompetitor**:

### 1. Prestisa

https://prestisa.com/

### 2. FlowerChimp

https://www.flowerchimp.com/

### 3. Irandra

Gunakan website resmi Irandra sebagai referensi kompetitor.

## Tujuan Competitive Benchmark

Jangan menyalin desain, branding, copywriting, atau layout kompetitor.

Gunakan kompetitor untuk memahami:

* Cara marketplace menampilkan produk
* Struktur katalog
* Kategori produk
* Product discovery
* Informasi produk
* Cara menampilkan harga
* Informasi pengiriman
* CTA pembelian
* Trust signal
* Promo
* Customer experience
* Struktur checkout
* Informasi partner/vendor
* Elemen yang membuat customer yakin melakukan pembelian

---

# 3. COMPETITIVE GAP ANALYSIS

Sebelum membuat UI, lakukan analisis konseptual terhadap kompetitor.

Buat matriks internal seperti:

| Area               | Prestisa  | FlowerChimp | Irandra   | Opportunity Platform             |
| ------------------ | --------- | ----------- | --------- | -------------------------------- |
| Product Discovery  | Benchmark | Benchmark   | Benchmark | Buat lebih mudah                 |
| Product Catalog    | Benchmark | Benchmark   | Benchmark | Agregasi multi-partner           |
| Partner Visibility | Evaluasi  | Evaluasi    | Evaluasi  | Jadikan partner lebih transparan |
| Order Tracking     | Evaluasi  | Evaluasi    | Evaluasi  | Tracking end-to-end              |
| Payment            | Benchmark | Benchmark   | Benchmark | Transaction protection           |
| Escrow Concept     | Evaluasi  | Evaluasi    | Evaluasi  | Diferensiasi utama               |
| Partner Dashboard  | Evaluasi  | Evaluasi    | Evaluasi  | Partner self-service             |
| Settlement         | Evaluasi  | Evaluasi    | Evaluasi  | Transparan                       |
| Dispute            | Evaluasi  | Evaluasi    | Evaluasi  | Trust layer                      |
| Multi-vendor       | Evaluasi  | Evaluasi    | Evaluasi  | Core marketplace                 |

Jika informasi suatu kompetitor tidak dapat diverifikasi, **jangan mengarang fakta**.

Gunakan istilah:

> "Tidak ditemukan / perlu validasi"

daripada membuat klaim palsu.

---

# 4. PRODUCT DIFFERENTIATION

Prototype harus memiliki positioning yang berbeda dari toko bunga online biasa.

Jangan menjadikan platform hanya sebagai:

> "Website untuk membeli bunga."

Positioning yang ingin divisualisasikan:

> **Marketplace terpercaya yang menghubungkan customer dengan berbagai penyedia jasa karangan bunga dan membantu mengamankan proses transaksi dari pemesanan hingga produk diterima.**

Diferensiasi utama:

### A. Multi-Partner

Customer dapat membandingkan berbagai penyedia jasa dalam satu platform.

### B. Transparent Partner

Customer dapat mengetahui siapa partner yang mengerjakan pesanannya.

### C. Transaction Protection

Customer mendapatkan informasi yang jelas mengenai status pembayaran.

### D. Order Tracking

Customer dapat melihat perkembangan pesanan.

### E. Settlement

Partner dapat mengetahui kapan dana transaksi tersedia untuk dicairkan.

### F. Dispute Handling

Tersedia mekanisme komplain apabila terjadi masalah.

---

# 5. PRIMARY USER

Ada tiga role:

## CUSTOMER

Mencari dan membeli produk.

## PARTNER

Penyedia jasa karangan bunga.

## ADMIN / OWNER

Pengelola marketplace.

---

# 6. CUSTOMER EXPERIENCE

## Homepage

Homepage harus langsung menjelaskan:

**Apa platform ini?**

**Mengapa customer harus menggunakan platform ini?**

Hero section:

> "Temukan Karangan Bunga dari Partner Terpercaya"

Subheadline:

> "Pilih, pesan, dan pantau karangan bunga dari berbagai penyedia jasa dalam satu platform."

CTA:

**Cari Karangan Bunga**

Secondary CTA:

**Lihat Semua Produk**

---

## Product Discovery

Sediakan:

* Search
* Category
* Price filter
* Location
* Delivery date
* Rating
* Partner
* Sort
* Availability

Kategori:

* Bunga Papan
* Standing Flower
* Buket
* Bunga Ucapan
* Hampers
* Hadiah
* Duka Cita
* Pernikahan
* Ulang Tahun
* Wisuda
* Anniversary

---

# 7. PRODUCT CARD

Product card harus menampilkan:

* Foto
* Nama produk
* Harga
* Partner
* Rating
* Jumlah review
* Area layanan
* Estimasi pengiriman
* Badge "Verified Partner"
* Badge "Popular" jika relevan

CTA:

**Lihat Detail**

Jangan memenuhi card dengan terlalu banyak informasi.

Prioritaskan:

**Visual → Produk → Harga → Partner → Trust → CTA**

---

# 8. PRODUCT DETAIL

Tampilkan:

* Gallery
* Nama produk
* Harga
* Partner
* Rating
* Review
* Deskripsi
* Material
* Ukuran
* Estimasi produksi
* Area pengiriman
* Delivery date
* Pesan ucapan
* Catatan customer

Tambahkan:

### Partner Information

Contoh:

**Dibuat oleh**

> Bunga Sejahtera
> ✓ Verified Partner
> ⭐ 4.9
> 1.2K orders

CTA:

**Pesan Sekarang**

---

# 9. TRUST LAYER

Trust harus menjadi bagian penting dari UI.

Tampilkan:

### Verified Partner

Partner telah diverifikasi platform.

### Secure Transaction

Pembayaran diproses melalui platform.

### Order Tracking

Customer dapat memantau status pesanan.

### Customer Support

Customer dapat menghubungi platform jika terjadi masalah.

### Dispute Protection

Customer dapat mengajukan komplain sesuai kebijakan platform.

Jangan membuat klaim hukum atau keamanan yang belum benar-benar tersedia.

---

# 10. CHECKOUT

Checkout harus sederhana.

Tampilkan:

### Product

Produk yang dipilih.

### Partner

Partner yang mengerjakan produk.

### Recipient

* Nama penerima
* Nomor telepon
* Alamat

### Delivery

* Tanggal
* Waktu
* Catatan pengiriman

### Message

Pesan ucapan.

### Payment Summary

Contoh:

```text
Harga Produk       Rp450.000
Delivery           Rp30.000
Platform Fee       Rp20.000
-----------------------------
Total              Rp500.000
```

Tambahkan informasi:

> Pembayaran akan diproses melalui platform dan status dana dapat dipantau sampai pesanan selesai.

---

# 11. PAYMENT PROTOTYPE

Gunakan simulasi:

* QRIS
* Bank Transfer
* E-Wallet

Tidak perlu integrasi payment gateway.

Setelah pembayaran:

```text
Payment: PAID
Order: PROCESSING
Settlement: PENDING
```

---

# 12. ORDER TRACKING

Gunakan visual timeline.

```text
Order Created
      ↓
Payment Confirmed
      ↓
Partner Accepted
      ↓
Being Prepared
      ↓
Ready to Ship
      ↓
On Delivery
      ↓
Delivered
      ↓
Customer Confirmed
      ↓
Partner Settlement
```

Customer harus dapat memahami posisi pesanannya dalam kurang dari beberapa detik.

---

# 13. PARTNER EXPERIENCE

Partner bukan sekadar seller.

Partner adalah bagian penting dari marketplace.

Buat:

## Partner Dashboard

Tampilkan:

* New Orders
* Active Orders
* Completed Orders
* Revenue
* Pending Settlement
* Available Balance

## Order Management

Partner dapat:

* Accept order
* Reject order
* Update production status
* Update shipping status
* Mark completed

Flow:

```text
New Order
↓
Accepted
↓
Preparing
↓
Ready
↓
Shipped
↓
Delivered
```

---

# 14. PARTNER PROFILE

Customer dapat melihat profil partner.

Tampilkan:

* Nama
* Logo/foto
* Verification
* Rating
* Total orders
* Response rate
* Area layanan
* Produk
* Review

Tujuan:

**Customer membeli dari platform, tetapi tetap merasa yakin terhadap partner yang mengerjakan produknya.**

---

# 15. PARTNER PRODUCT MANAGEMENT

Partner dapat:

* Add product
* Edit product
* Delete product
* Price
* Availability
* Delivery area
* Production time
* Product image

Gunakan dummy interaction.

Tidak perlu backend.

---

# 16. PARTNER WALLET / SETTLEMENT

Tampilkan:

```text
Total Sales
Rp10.000.000

Platform Fee
Rp1.000.000

Partner Revenue
Rp9.000.000
```

Status:

* Pending
* Available
* Withdrawn

Contoh transaksi:

```text
Order #INV-001

Customer Payment
Rp500.000

Platform Fee
Rp50.000

Partner Settlement
Rp450.000

Status
Pending
```

---

# 17. ADMIN / OWNER DASHBOARD

Admin harus dapat memahami kondisi bisnis dalam satu layar.

Tampilkan:

* GMV
* Revenue
* Orders
* Customers
* Partners
* Active Orders
* Pending Settlement
* Disputes

Gunakan visualisasi sederhana.

Jangan membuat dashboard penuh grafik yang tidak berguna.

---

# 18. ADMIN TRANSACTION

Tampilkan:

* Order ID
* Customer
* Partner
* Product
* Amount
* Platform Fee
* Payment Status
* Order Status
* Settlement Status

Admin dapat membuka detail transaksi.

---

# 19. ADMIN PARTNER MANAGEMENT

Tampilkan:

* Partner
* Verification
* Products
* Orders
* Revenue
* Rating
* Status

Status:

* Pending Verification
* Active
* Suspended

---

# 20. ADMIN SETTLEMENT

Visualisasikan:

```text
Customer
   ↓
Payment
   ↓
Platform
   ↓
Pending Settlement
   ↓
Order Completed
   ↓
Platform Fee
   ↓
Partner
```

Tujuan halaman ini bukan membuat sistem escrow nyata.

Tujuannya adalah:

**memvisualisasikan konsep bisnis kepada owner.**

---

# 21. ADMIN DISPUTE

Buat halaman sederhana.

Contoh:

```text
Order #INV-009

Issue:
Produk tidak sesuai pesanan

Customer:
Budi

Partner:
Flower House

Amount:
Rp650.000

Status:
Under Review
```

Action:

* Review
* Contact Customer
* Contact Partner
* Refund
* Release Settlement

Semua cukup simulasi.

---

# 22. DESIGN STRATEGY

Jangan membuat desain seperti:

* Template marketplace generik
* Template SaaS
* Dashboard Bootstrap
* Clone Tokopedia/Shopee
* Clone kompetitor

Gunakan pendekatan:

**Premium marketplace + emotional commerce + trust platform**

Visual harus terasa:

* Elegant
* Warm
* Premium
* Modern
* Trustworthy
* Human

Produk bunga harus menjadi visual hero.

Gunakan:

* Large photography
* Strong typography
* Spacious layout
* Editorial composition
* Subtle animation
* Rounded but sophisticated UI
* Clear CTA
* Strong visual hierarchy

---

# 23. COMPETITIVE DIFFERENTIATION UI

Jangan meniru kompetitor.

Cari peluang untuk membuat UX lebih kuat pada:

### Discovery

Membantu customer menemukan produk berdasarkan **momen**, bukan hanya kategori.

Contoh:

> "Untuk siapa?"

* Pasangan
* Orang tua
* Teman
* Rekan kerja
* Klien

> "Untuk momen apa?"

* Ulang Tahun
* Pernikahan
* Wisuda
* Duka Cita
* Anniversary
* Congratulations

---

### Partner Comparison

Berikan kemampuan membandingkan partner berdasarkan:

* Harga
* Rating
* Jarak
* Delivery time
* Review
* Reliability

---

### Transaction Transparency

Buat customer dapat melihat:

> **"Uang saya sekarang berada di tahap mana?"**

Contoh:

```text
✓ Payment received
✓ Partner confirmed
✓ Product being prepared
● Waiting for delivery
○ Settlement after completion
```

Ini harus menjadi salah satu visual pembeda utama platform.

---

# 24. HOMEPAGE INFORMATION ARCHITECTURE

Susunan homepage:

```text
Navigation

Hero
↓
Search
↓
Shop by Occasion
↓
Popular Products
↓
Trusted Partners
↓
How It Works
↓
Transaction Protection
↓
Partner CTA
↓
Customer Reviews
↓
FAQ
↓
Footer
```

---

# 25. BRAND

Gunakan nama sementara:

**BloomHub**

Tagline:

**"Kirim Kebaikan, Sampai ke Hati."**

Nama dan tagline harus dibuat sebagai variable/config sehingga mudah diganti.

Jangan menganggap brand ini sebagai keputusan final.

---

# 26. TECH STACK

Gunakan:

* Svelte
* SvelteKit
* TypeScript
* Tailwind CSS

Gunakan reusable components.

Struktur:

```text
src/
├── lib/
│   ├── components/
│   ├── data/
│   ├── types/
│   ├── stores/
│   └── utils/
│
└── routes/
    ├── /
    ├── products/
    ├── checkout/
    ├── orders/
    ├── partners/
    ├── partner/
    └── admin/
```

Gunakan mock data lokal.

Tidak perlu backend.

---

# 27. PROTOTYPE STATE

Gunakan mock state untuk mensimulasikan:

* Customer
* Partner
* Admin
* Product
* Order
* Payment
* Settlement
* Dispute

Contoh:

```typescript
type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'disputed';
```

---

# 28. DEMO DATA

Gunakan minimal:

* 12 products
* 5 partners
* 5 customers
* 8 orders
* Multiple order statuses
* Multiple categories
* Multiple locations

Data harus terasa realistis.

---

# 29. RESPONSIVE

Customer:

**Mobile-first**

Admin:

**Desktop-first**

Tetap responsive untuk:

* Mobile
* Tablet
* Desktop

---

# 30. PRIMARY DEMO FLOW

Prototype harus bisa didemokan seperti ini:

### Customer

```text
Homepage
↓
Search "Bunga Ulang Tahun"
↓
Product Listing
↓
Product Detail
↓
Partner Profile
↓
Checkout
↓
Payment
↓
Order Tracking
```

### Partner

```text
Partner Dashboard
↓
New Order
↓
Accept
↓
Preparing
↓
Ready
↓
Shipped
↓
Completed
```

### Admin

```text
Admin Dashboard
↓
Transaction
↓
Settlement
↓
Partner
↓
Dispute
```

---

# 31. FEATURE PRIORITY

## P0 — Core Prototype

* Homepage
* Product discovery
* Product listing
* Product detail
* Partner profile
* Checkout
* Simulated payment
* Order tracking
* Partner dashboard
* Admin dashboard
* Transaction
* Settlement visualization

## P1 — Important

* Search
* Filter
* Reviews
* Partner comparison
* Product management
* Dispute
* Partner verification

## P2 — Future

* Wishlist
* Voucher
* Chat
* Notification
* Recommendation engine
* AI recommendation
* Advanced analytics
* Real payment gateway
* Real escrow/settlement

Jangan mengembangkan P2 sebelum P0 terlihat matang.

---

# 32. IMPORTANT PRODUCT PRINCIPLE

Prototype ini harus membuktikan bahwa platform memiliki **value proposition yang berbeda dari sekadar toko bunga online.**

Perbedaan utama harus terasa melalui UX:

**Competitor:**

Customer → Website → Product → Purchase

**Our Platform:**

Customer
↓
Discover
↓
Compare Partners
↓
Choose Product
↓
Protected Transaction
↓
Track Order
↓
Confirm Delivery
↓
Partner Settlement

Dengan demikian, platform diposisikan sebagai:

> **Trusted marketplace infrastructure for flower and gift service providers.**

---

# 33. DEVELOPMENT RULES

Sebelum coding:

1. Analisis business model.
2. Analisis competitive benchmark.
3. Identifikasi competitive gap.
4. Tentukan product differentiation.
5. Tentukan information architecture.
6. Tentukan user flow.
7. Tentukan reusable components.
8. Tentukan mock data.
9. Baru implementasikan UI.

Jangan langsung coding.

Jika terdapat requirement ambigu:

* Jangan mengarang business rule baru.
* Gunakan asumsi paling sederhana.
* Dokumentasikan asumsi tersebut.

---

# 34. FINAL QUALITY CHECK

Sebelum menyelesaikan prototype, evaluasi:

### Business

* Apakah konsep agregator jelas?
* Apakah peran platform jelas?
* Apakah partner jelas?
* Apakah model settlement terlihat?

### UX

* Apakah customer mudah menemukan produk?
* Apakah customer memahami siapa partner-nya?
* Apakah customer memahami status pesanannya?
* Apakah customer memahami status pembayaran?

### Competitive

* Apakah prototype memiliki fitur marketplace yang kompetitif?
* Apakah ada diferensiasi yang jelas?
* Apakah UI hanya meniru marketplace bunga lain?

### Design

* Apakah visual terasa premium?
* Apakah bunga menjadi focal point?
* Apakah layout memiliki hierarchy?
* Apakah tidak terasa seperti template SaaS?

### Technical

* Apakah routing berfungsi?
* Apakah semua CTA utama bekerja?
* Apakah mock state konsisten?
* Apakah responsive?
* Apakah component reusable?

---

# FINAL OBJECTIVE

Hasil akhir harus berupa prototype Svelte yang dapat digunakan untuk melakukan **demo bisnis kepada owner dan stakeholder**, bukan sekadar demonstrasi coding.

Ketika owner membuka prototype, ia harus langsung memahami:

> **"Ini adalah platform yang mempertemukan customer dengan banyak penyedia karangan bunga, membantu customer memilih dan memesan, mengamankan alur transaksi, memantau pesanan, lalu menyelesaikan pembayaran kepada partner setelah pesanan selesai."**

Prototype harus menunjukkan **mengapa platform ini lebih bernilai daripada sekadar website toko bunga biasa.**
