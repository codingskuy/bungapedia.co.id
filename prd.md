# Product Requirements Document (PRD)

# Bungapedia

> **Hantarkan Apresiasi, Satukan Kebersamaan**

**Product Type:** Marketplace / Aggregator  
**Business Model:** Multi-vendor marketplace  
**Target Market:** Customer & penyedia jasa karangan bunga/hadiah  
**Platform:** Web-first  
**Product Stage:** MVP / Prototype Validation  
**Document Version:** 1.0  
**Date:** September 2026

---

# 1. Executive Summary

**Bungapedia** adalah platform marketplace/agregator yang mempertemukan customer dengan berbagai penyedia jasa karangan bunga dan hadiah dalam satu platform.

Bungapedia tidak berfokus untuk menjadi produsen karangan bunga sendiri. Platform berperan sebagai **mediator digital** yang membantu:

- Customer menemukan produk.
- Customer membandingkan pilihan partner.
- Customer melakukan pemesanan.
- Customer melakukan pembayaran.
- Customer memantau proses pesanan.
- Partner menerima dan mengerjakan pesanan.
- Platform mengelola transaksi dan settlement.
- Platform menangani monitoring dan dispute.

Konsep utama Bungapedia:

> **Customer menemukan → memilih → memesan → membayar → memantau → menerima → partner mendapatkan settlement.**

Dengan demikian, Bungapedia bukan sekadar website katalog bunga, tetapi sebuah **infrastruktur marketplace untuk layanan karangan bunga dan hadiah.**

---

# 2. Vision

Menjadi platform terpercaya untuk menghubungkan masyarakat dengan penyedia jasa karangan bunga dan hadiah dalam berbagai momen kehidupan.

Bungapedia ingin membuat proses memberikan apresiasi menjadi lebih mudah, transparan, dan dapat diandalkan.

### Brand Promise

> **Hantarkan Apresiasi, Satukan Kebersamaan.**

---

# 3. Problem Statement

Saat ini customer yang ingin memesan karangan bunga atau hadiah sering menghadapi beberapa masalah:

### Customer

- Harus mencari penyedia jasa satu per satu.
- Sulit membandingkan harga dan kualitas.
- Informasi produk tidak selalu lengkap.
- Tidak selalu mengetahui reputasi penyedia jasa.
- Status pesanan kurang transparan.
- Mekanisme pembayaran berbeda-beda.
- Sulit mendapatkan bantuan ketika terjadi masalah.

### Penyedia Jasa

- Bergantung pada pemasaran melalui media sosial.
- Sulit mendapatkan customer baru secara konsisten.
- Pengelolaan order masih manual.
- Tidak memiliki sistem digital yang terintegrasi.
- Sulit membangun trust dengan customer baru.

### Peluang Bungapedia

Bungapedia menjadi pihak yang menghubungkan kedua kebutuhan tersebut:

**Customer membutuhkan convenience + trust**

dan

**Partner membutuhkan distribution + customer acquisition.**

---

# 4. Product Positioning

Bungapedia diposisikan sebagai:

> **Marketplace terpercaya yang menghubungkan customer dengan berbagai penyedia jasa karangan bunga dan hadiah, dari pencarian hingga penyelesaian transaksi.**

Bungapedia **bukan hanya toko bunga online**.

Perbedaannya:

### Toko Bunga Online

Customer  
↓  
Satu toko  
↓  
Produk  
↓  
Pembayaran

### Bungapedia

Customer  
↓  
Banyak Partner  
↓  
Discovery  
↓  
Comparison  
↓  
Product Selection  
↓  
Protected Transaction  
↓  
Order Tracking  
↓  
Delivery  
↓  
Settlement

---

# 5. Target Users

## 5.1 Customer

Orang yang ingin mengirim:

- Karangan bunga
- Bunga papan
- Buket
- Standing flower
- Hampers
- Hadiah
- Ucapan
- Produk untuk berbagai momen

### Customer Persona

Contoh:

**Rina — Working Professional**

Kebutuhan:

> Ingin mengirim bunga ulang tahun kepada orang tua di kota lain.

Pain point:

- Tidak tahu toko bunga yang terpercaya.
- Tidak punya banyak waktu.
- Ingin produk sampai sesuai jadwal.
- Ingin mengetahui status pengiriman.

---

# 5.2 Partner

Penyedia jasa:

- Florist
- Toko bunga
- Pembuat karangan bunga
- Penyedia hampers
- Penyedia gift
- Penyedia layanan dekorasi tertentu

Partner menggunakan Bungapedia untuk mendapatkan order dan mengelola pesanan.

---

# 5.3 Admin / Owner

Pemilik dan operator platform.

Bertanggung jawab terhadap:

- Customer
- Partner
- Product
- Transaction
- Settlement
- Dispute
- Platform revenue
- Operational monitoring

---

# 6. Business Model

Model bisnis utama:

## Transaction Commission

Bungapedia mendapatkan komisi dari setiap transaksi.

Contoh:

```text
Harga Produk        Rp500.000
Biaya Pengiriman    Rp30.000
Platform Fee        Rp20.000
-----------------------------
Total Customer      Rp550.000

Partner Revenue     Rp500.000
Platform Revenue    Rp20.000
Delivery             Rp30.000*
```

*Pembagian biaya pengiriman perlu ditentukan lebih lanjut berdasarkan model operasional.

Besaran komisi **belum ditetapkan** dan harus divalidasi bersama owner.

---

# 7. Core Business Flow

```text
Customer
   ↓
Browse Product
   ↓
Choose Product
   ↓
Choose Partner
   ↓
Checkout
   ↓
Payment
   ↓
Payment Pending / Protected
   ↓
Partner Accepts Order
   ↓
Production
   ↓
Delivery
   ↓
Customer Receives Product
   ↓
Customer Confirmation
   ↓
Partner Settlement
```

---

# 8. Transaction Model

Konsep transaksi Bungapedia:

### Stage 1 — Payment

Customer melakukan pembayaran melalui platform.

Status:

**Paid**

---

### Stage 2 — Protected / Pending

Dana belum dianggap sebagai pendapatan partner.

Status:

**Settlement Pending**

---

### Stage 3 — Production

Partner menerima dan mengerjakan pesanan.

Status:

**Preparing**

---

### Stage 4 — Delivery

Produk dikirim.

Status:

**Shipped**

---

### Stage 5 — Customer Confirmation

Customer menerima produk.

Status:

**Delivered**

Customer mengonfirmasi penerimaan.

---

### Stage 6 — Settlement

Dana transaksi dapat diproses untuk partner.

Status:

**Available for Settlement**

---

# 9. Important Regulatory Consideration

Konsep **"dompet bersama" / escrow** merupakan area yang perlu mendapatkan kajian lebih lanjut.

Untuk MVP:

- Jangan menyimpan dana customer secara mandiri.
- Jangan membangun payment infrastructure sendiri.
- Gunakan payment provider yang sesuai dan mendukung mekanisme settlement yang dibutuhkan.
- Bungapedia mengelola status transaksi dan settlement di level aplikasi.
- Legal, payment flow, refund, dan settlement harus divalidasi sebelum production.

Istilah "escrow" dalam prototype dapat digunakan sebagai **visualisasi konsep**, bukan klaim bahwa Bungapedia sudah menjadi penyelenggara escrow secara legal.

---

# 10. Product Scope

## MVP

### Customer

- Homepage
- Product discovery
- Search
- Category
- Filter
- Product detail
- Partner information
- Checkout
- Payment simulation
- Order tracking
- Order history
- Customer confirmation

### Partner

- Partner registration
- Partner profile
- Product management
- Order management
- Order status
- Revenue dashboard
- Settlement status

### Admin

- Dashboard
- Customer management
- Partner management
- Product management
- Order management
- Payment monitoring
- Settlement monitoring
- Dispute management

---

# 11. Customer Requirements

## 11.1 Homepage

Homepage harus menjawab tiga pertanyaan:

**Apa Bungapedia?**

Marketplace karangan bunga dan hadiah.

**Apa yang bisa dilakukan?**

Mencari, memilih, memesan, dan memantau pesanan.

**Mengapa harus menggunakan Bungapedia?**

Banyak pilihan partner + transaksi lebih transparan.

---

## 11.2 Product Discovery

Customer dapat mencari berdasarkan:

### Category

- Bunga Papan
- Standing Flower
- Buket
- Bunga Ucapan
- Hampers
- Gift

### Occasion

- Ulang Tahun
- Pernikahan
- Wisuda
- Anniversary
- Congratulations
- Duka Cita
- Hari Raya
- Apresiasi
- Corporate

### Recipient

- Pasangan
- Orang Tua
- Teman
- Rekan Kerja
- Klien
- Keluarga

Pendekatan **occasion + recipient** merupakan salah satu peluang diferensiasi UX Bungapedia.

---

# 12. Product Requirements

Setiap produk minimal memiliki:

- Product name
- Product image
- Description
- Price
- Category
- Occasion
- Partner
- Rating
- Review count
- Production time
- Delivery area
- Availability
- Product size
- Materials

---

# 13. Partner Requirements

Setiap partner memiliki:

- Nama bisnis
- Logo
- Deskripsi
- Verification status
- Rating
- Review
- Total orders
- Response rate
- Delivery area
- Production time
- Product catalog

### Partner Badge

Partner dapat memiliki status:

**Verified Partner**

Status verification dikontrol admin.

---

# 14. Checkout Requirements

Customer harus mengisi:

### Recipient

- Name
- Phone
- Address

### Delivery

- Delivery date
- Delivery time
- Delivery notes

### Message

Pesan atau ucapan yang ingin disampaikan.

### Payment

- QRIS
- Bank transfer
- E-wallet

Metode pembayaran aktual akan ditentukan pada fase integrasi payment provider.

---

# 15. Order Management

Order memiliki lifecycle:

```text
Pending Payment
↓
Paid
↓
Partner Confirmation
↓
Preparing
↓
Ready to Ship
↓
Shipped
↓
Delivered
↓
Completed
```

Jika terdapat masalah:

```text
Any Stage
↓
Disputed
↓
Under Review
↓
Resolved
```

---

# 16. Order Tracking

Customer dapat melihat:

- Order ID
- Product
- Partner
- Payment status
- Production status
- Shipping status
- Delivery status
- Estimated delivery

Timeline:

```text
✓ Order Created
✓ Payment Confirmed
✓ Partner Accepted
● Being Prepared
○ Ready to Ship
○ On Delivery
○ Delivered
○ Completed
```

---

# 17. Partner Dashboard

Dashboard menampilkan:

### Overview

- New Orders
- Active Orders
- Completed Orders
- Revenue
- Pending Settlement
- Available Balance

### Order

Partner dapat:

- Accept
- Reject
- Update production
- Update shipping
- Complete order

---

# 18. Partner Product Management

Partner dapat:

- Create product
- Edit product
- Delete product
- Upload image
- Set price
- Set availability
- Set production time
- Set delivery area

Produk baru dapat membutuhkan approval admin.

---

# 19. Settlement

Settlement dashboard partner:

```text
Total Sales
Rp10.000.000

Platform Fee
Rp1.000.000

Partner Revenue
Rp9.000.000
```

Status:

- Pending
- Available
- Withdrawn

---

# 20. Admin Dashboard

Dashboard owner menampilkan:

### Business Metrics

- GMV
- Platform Revenue
- Total Orders
- Active Orders
- Customers
- Partners
- Pending Settlement
- Disputes

### Operational Metrics

- Pending Orders
- Late Orders
- Failed Orders
- Disputed Orders

Dashboard harus memberikan gambaran kondisi bisnis dengan cepat.

---

# 21. Admin Partner Management

Admin dapat:

- View partner
- Verify partner
- Approve partner
- Suspend partner
- View partner performance
- View products
- View transactions

---

# 22. Admin Product Management

Admin dapat:

- Review product
- Approve product
- Reject product
- Disable product
- Edit category
- Manage featured products

---

# 23. Dispute Management

Customer dapat mengajukan masalah:

- Produk tidak sesuai
- Produk rusak
- Produk terlambat
- Produk tidak diterima
- Kesalahan pesanan

Admin dapat melakukan:

- Review
- Contact customer
- Contact partner
- Refund
- Partial refund
- Release settlement
- Reject dispute

Untuk MVP, seluruh proses dapat dilakukan secara manual oleh admin.

---

# 24. Competitive Benchmark

Kompetitor yang digunakan sebagai benchmark awal:

1. **Prestisa**
2. **FlowerChimp**
3. **Irandra**

Benchmark digunakan untuk mengevaluasi:

- Product discovery
- Catalog
- Category
- Product detail
- Pricing
- Delivery information
- Checkout
- Trust signal
- Promotion
- Customer experience
- Partner/vendor experience
- Transaction experience

### Prinsip

Bungapedia **tidak boleh menjadi clone kompetitor**.

Kompetitor digunakan untuk:

> **Learn → Compare → Identify Gap → Differentiate**

Bukan:

> **Copy → Rebrand → Launch**

---

# 25. Competitive Opportunity

Area yang berpotensi menjadi diferensiasi Bungapedia:

## 25.1 Multi-Partner Discovery

Customer dapat menemukan berbagai partner dalam satu platform.

## 25.2 Partner Transparency

Customer mengetahui siapa yang mengerjakan produknya.

## 25.3 Partner Comparison

Customer dapat membandingkan:

- Harga
- Rating
- Delivery
- Review
- Area
- Reliability

## 25.4 Transaction Transparency

Customer dapat melihat status transaksi dan order secara jelas.

## 25.5 Settlement Infrastructure

Partner dapat mengetahui status pendapatan mereka.

## 25.6 Dispute Layer

Platform menjadi pihak mediator ketika terjadi masalah.

---

# 26. UX Principles

Bungapedia harus mengikuti prinsip:

### 1. Simple

Customer tidak perlu memahami cara kerja marketplace.

### 2. Trustworthy

Customer harus merasa aman melakukan transaksi.

### 3. Emotional

Produk berhubungan dengan momen emosional.

### 4. Transparent

Status order dan transaksi mudah dipahami.

### 5. Human

Platform tidak terasa seperti sistem korporat yang kaku.

### 6. Premium

Visual harus mencerminkan kualitas produk.

---

# 27. Brand Experience

Nama:

# Bungapedia

Tagline:

> **Hantarkan Apresiasi, Satukan Kebersamaan**

Brand personality:

- Warm
- Trustworthy
- Elegant
- Human
- Helpful
- Modern

Bungapedia harus terasa seperti **teman yang membantu memilih hadiah untuk orang penting**, bukan sekadar katalog produk.

---

# 28. Design Direction

Visual:

- Premium
- Editorial
- Warm
- Elegant
- Clean
- Spacious

Prioritas visual:

**Product Photography → Emotion → Trust → Information → CTA**

Hindari:

- Marketplace generik
- Terlalu banyak card
- Dashboard penuh angka
- Warna terlalu ramai
- Gradient berlebihan
- Clone marketplace besar

---

# 29. Technical Direction

Prototype:

- Svelte
- SvelteKit
- TypeScript
- Tailwind CSS

MVP production dapat dikaji lebih lanjut.

Untuk prototype:

- Mock data
- Local state
- Simulated payment
- Simulated settlement
- Simulated authentication

Backend belum menjadi requirement prototype.

---

# 30. Non-Functional Requirements

## Performance

- Fast initial load
- Optimized images
- Lazy loading
- Minimal unnecessary JavaScript

## Responsive

Customer:

**Mobile-first**

Admin:

**Desktop-first**

## Accessibility

- Semantic HTML
- Keyboard navigation
- Readable contrast
- Accessible forms
- Clear error messages

## Maintainability

- Reusable components
- Typed data
- Clear folder structure
- Consistent naming
- Separation of UI and business state

---

# 31. MVP Out of Scope

Fitur berikut tidak menjadi prioritas MVP:

- Native mobile app
- Real escrow infrastructure
- Complex payment infrastructure
- AI recommendation
- Chat system
- Advanced analytics
- Loyalty program
- Subscription
- Multi-country operation
- Complex logistics management
- Automated dispute resolution

Fitur tersebut dapat masuk roadmap berikutnya setelah business model tervalidasi.

---

# 32. Success Metrics

MVP harus membantu mengukur:

### Customer

- Product discovery rate
- Product detail engagement
- Checkout conversion
- Completed order
- Repeat order
- Customer satisfaction

### Partner

- Partner activation
- Product activation
- Order acceptance rate
- Order completion rate
- Partner retention

### Business

- GMV
- Platform revenue
- Average order value
- Number of active partners
- Number of active customers
- Transaction completion rate

### Trust

- Dispute rate
- Refund rate
- Failed delivery rate
- Late delivery rate

---

# 33. MVP Success Criteria

MVP dianggap berhasil secara product validation apabila:

1. Customer memahami value Bungapedia tanpa penjelasan panjang.
2. Customer dapat menemukan produk dengan mudah.
3. Customer memahami siapa partner yang mengerjakan produk.
4. Customer dapat menyelesaikan simulasi transaksi.
5. Customer memahami status pesanan.
6. Partner memahami bagaimana menerima order.
7. Partner memahami status pendapatan.
8. Owner dapat melihat transaksi dan kondisi bisnis.
9. Konsep marketplace multi-partner terlihat jelas.
10. Konsep transaction protection dapat dipahami tanpa mengklaim escrow legal.

---

# 34. Future Roadmap

## Phase 1 — Validation

- Prototype
- User testing
- Competitive research
- Business validation
- Partner interviews

## Phase 2 — MVP

- Real authentication
- Real database
- Partner onboarding
- Product management
- Order management
- Payment integration
- Basic settlement
- Admin dashboard

## Phase 3 — Growth

- Review
- Promotion
- Voucher
- Notification
- Partner analytics
- Customer loyalty
- Recommendation

## Phase 4 — Platform

- AI recommendation
- Intelligent search
- Partner optimization
- Advanced analytics
- Automated operations
- Logistics integration

---

# 35. Key Risks

## Business Risk

Tidak cukup partner atau customer.

**Mitigation:** mulai dari area geografis terbatas dan partner terpilih.

## Operational Risk

Partner terlambat atau tidak memenuhi pesanan.

**Mitigation:** SLA, partner rating, monitoring, dan dispute mechanism.

## Trust Risk

Customer tidak puas dengan produk.

**Mitigation:** verified partner, review, product information, dispute mechanism.

## Payment Risk

Masalah settlement atau refund.

**Mitigation:** gunakan payment provider yang sesuai dan jangan membangun penyimpanan dana sendiri pada tahap awal.

## Marketplace Chicken-and-Egg Problem

Customer membutuhkan banyak pilihan, tetapi partner membutuhkan customer.

**Mitigation:** mulai dengan supply partner yang cukup pada satu wilayah/kategori sebelum memperluas marketplace.

---

# 36. Open Questions

Hal berikut harus diputuskan bersama owner:

1. Area geografis awal Bungapedia?
2. Produk apa yang menjadi fokus pertama?
3. Berapa komisi platform?
4. Siapa yang menentukan biaya pengiriman?
5. Kapan partner dianggap berhak menerima settlement?
6. Apakah customer dapat memilih partner?
7. Apakah partner dapat menolak order?
8. Bagaimana SLA partner?
9. Bagaimana refund?
10. Bagaimana dispute?
11. Siapa yang menangani customer support?
12. Payment provider apa yang akan digunakan?
13. Apakah Bungapedia akan menggunakan model marketplace murni atau managed marketplace?
14. Apakah partner harus diverifikasi sebelum dapat berjualan?
15. Apakah Bungapedia akan fokus pada B2C atau juga corporate/B2B?

---

# 37. Product Principle

Bungapedia tidak dibangun untuk menjadi:

> **"Toko bunga terbesar."**

Bungapedia dibangun untuk menjadi:

> **"Tempat terpercaya untuk menghubungkan orang yang ingin memberikan apresiasi dengan partner yang dapat membantu mewujudkannya."**

Dengan tagline:

# **Hantarkan Apresiasi, Satukan Kebersamaan**

---

# 38. Final Product Statement

**Bungapedia adalah marketplace agregator karangan bunga dan hadiah yang mempertemukan customer dengan berbagai penyedia jasa terpercaya dalam satu platform, mulai dari pencarian produk, pemesanan, pembayaran, pemantauan pesanan, hingga penyelesaian transaksi dengan partner.**