<!-- Tentang Bungapedia — cerita perusahaan sebagai penjual tunggal (partner hidden). -->
<script lang="ts">
  import { COMPANY_LEGAL } from '../market-data';
  import { catalog } from '../ops-store';
</script>

<div class="about" data-od-id="tentang">
  <section class="hero">
    <p class="eyebrow">Tentang Bungapedia</p>
    <h1>Hantarkan Apresiasi,<br />Satukan Kebersamaan.</h1>
    <p class="lede">Bungapedia adalah toko rangkaian bunga & hadiah kurasi — kamu memilih, memesan, membayar, dan memantau pesanan dalam satu platform. Semua rangkaian dikurasi, dirangkai, dan dikirim oleh Bungapedia.</p>
    <div class="stats">
      <div><b>{$catalog.length}+</b><span>rangkaian kurasi</span></div>
      <div><b>4.8 ★</b><span>rating rata-rata</span></div>
      <div><b>Same-day</b><span>Jabodetabek & Bandung</span></div>
    </div>
    <p class="legal">Dikelola oleh <b>{COMPANY_LEGAL}</b></p>
  </section>

  <section class="band">
    <div class="container narrow">
      <p class="eyebrow">Bagaimana kami bekerja</p>
      <h2>Kurasi → Rangkai → Foto QC → Kirim</h2>
      <p>Setiap rangkaian dipilih bahannya, dirangkai dengan standar Bungapedia, difoto untuk QC sebelum dikirim, lalu diantar tepat waktu ke alamat penerima. Kamu cukup memilih momen dan menulis kartu ucapan — sisanya kami urus.</p>
      <div class="flow">
        <span>Pilih rangkaian</span>→<span>Pesan & bayar</span>→<span>Kami siapkan & foto QC</span>→<span>Konfirmasi terima</span>
      </div>
      <p class="note">Dana berstatus <b>Pending</b> sampai kamu konfirmasi pesanan selesai. Ini visualisasi proteksi transaksi untuk prototype — bukan klaim escrow legal.</p>
      <p class="note">Badan hukum: <b>{COMPANY_LEGAL}</b> — pengelola platform Bungapedia.co.id</p>
    </div>
  </section>

  <section class="container narrow">
    <p class="eyebrow">Prinsip kami</p>
    <h2>Teman yang membantu memilih hadiah.</h2>
    <div class="grid">
      <div class="card"><b>Simpel</b><p>Pesan dalam menit, tanpa perlu paham sistem di belakangnya.</p></div>
      <div class="card"><b>Tepercaya</b><p>Transaksi via platform, ada foto QC, dan bantuan 1×24 jam.</p></div>
      <div class="card"><b>Emosional</b><p>Setiap produk untuk momen penting — kartu ucapan adalah intinya.</p></div>
      <div class="card"><b>Transparan</b><p>Status pesanan dan pembayaran selalu terlihat.</p></div>
      <div class="card"><b>Manusiawi</b><p>Bicara dengan manusia lewat chat bantuan, bukan tiket tanpa wajah.</p></div>
      <div class="card"><b>Premium</b><p>Fotografi produk jujur + foto QC sebelum kirim.</p></div>
    </div>
  </section>

  <section class="band cta">
    <div class="container narrow">
      <h2>Siap kirim apresiasi hari ini?</h2>
      <p>Pilih rangkaian untuk ulang tahun, wisuda, duka cita, atau corporate — kami siapkan dan antar tepat waktu.</p>
      <p><a class="btn btn-primary" href="#/produk" data-od-id="tentang-cta">Jelajahi katalog →</a>
      <a class="btn" href="#/pesan">Butuh bantuan? Chat kami</a></p>
      <p class="note">Butuh bantuan? Masuk lalu buka <a class="link-more" href="#/pesan">Bantuan & chat</a> — tim merespons 1×24 jam.</p>
    </div>
  </section>
</div>

<style>
  .about { font-family: var(--font-ui); }
  .hero { max-width: 900px; margin: 0 auto; padding: 56px 24px 40px; text-align: center; }
  .hero h1 { font-family: var(--font-display); color: var(--ink); font-size: clamp(36px,5vw,58px); line-height: 1.08; margin: 8px 0 16px; }
  .lede { color: #4b5563; font-size: 17px; line-height: 1.7; max-width: 62ch; margin: 0 auto; }
  .stats { display: flex; gap: 36px; justify-content: center; margin-top: 28px; }
  .stats b { display: block; font-size: 30px; color: var(--ink); } .stats span { font-size: 13px; color: var(--muted); }
  .band { background: #fff; border-block: 1px solid var(--border); }
  .narrow { max-width: 900px; margin: 0 auto; padding: 48px 24px; }
  .narrow h2 { font-family: var(--font-display); color: var(--ink); font-size: clamp(24px,3vw,32px); margin: 6px 0 12px; }
  .narrow p { color: #4b5563; line-height: 1.7; font-size: 15.5px; }
  .flow { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 18px 0; font-size: 13px; font-weight: 700; }
  .flow span { background: var(--accent-soft); color: var(--accent-dark); border-radius: 999px; padding: 8px 14px; }
  .note { font-size: 13.5px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; }
  .legal { margin-top: 20px; font-size: 13.5px; color: var(--muted); }
  .legal b { color: var(--ink); }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 18px; }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 18px; }
  .card b { color: var(--ink); font-size: 15.5px; } .card p { font-size: 13.5px; margin: 6px 0 0; }
  .cta { text-align: center; margin-top: 8px; }
  .cta p { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } .stats { gap: 20px; flex-wrap: wrap; } }
</style>
