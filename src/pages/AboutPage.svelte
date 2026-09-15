<!-- Tentang Bungapedia — cerita perusahaan, model marketplace, prinsip, CTA. -->
<script lang="ts">
  import { COMPANY_LEGAL, PARTNERS } from '../market-data';
  import { catalog } from '../ops-store';

  const base = import.meta.env.BASE_URL;
  $: areas = [...new Set(PARTNERS.flatMap((p) => p.area))];
</script>

<div class="about" data-od-id="tentang">
  <section class="hero">
    <p class="eyebrow">Tentang Bungapedia</p>
    <h1>Hantarkan Apresiasi,<br />Satukan Kebersamaan.</h1>
    <p class="lede">Bungapedia adalah marketplace yang mempertemukan kamu dengan berbagai penyedia jasa karangan bunga dan hadiah dalam satu platform — dari pencarian, pemesanan, pembayaran, pemantauan, hingga penyelesaian transaksi dengan partner.</p>
    <div class="stats">
      <div><b>{PARTNERS.length}</b><span>partner terkurasi</span></div>
      <div><b>{$catalog.length}+</b><span>produk live</span></div>
      <div><b>{areas.length}</b><span>area layanan</span></div>
    </div>
    <p class="legal">Dikelola oleh <b>{COMPANY_LEGAL}</b></p>
  </section>

  <section class="band">
    <div class="container narrow">
      <p class="eyebrow">Bukan sekadar toko bunga</p>
      <h2>Kami infrastruktur-nya, partner ahlinya.</h2>
      <p>Bungapedia tidak memproduksi rangkaian sendiri. Kami berperan sebagai <b>mediator digital</b>: membantu kamu menemukan produk, membandingkan partner, memesan dan membayar dalam satu tempat, lalu memantau pesanan sampai diterima. Partner — florist dan penyedia jasa terverifikasi — yang mengerjakan dan mengirimkan karyanya.</p>
      <div class="flow">
        <span>Temukan</span>→<span>Pesan & bayar via platform</span>→<span>Pantau</span>→<span>Konfirmasi → settlement partner</span>
      </div>
      <p class="note">Dana berstatus <b>Pending</b> sampai kamu konfirmasi pesanan selesai. Ini visualisasi proteksi transaksi untuk prototype — bukan klaim escrow legal.</p>
      <p class="note">Badan hukum: <b>{COMPANY_LEGAL}</b> — pengelola platform Bungapedia.co.id</p>
    </div>
  </section>

  <section class="container narrow">
    <p class="eyebrow">Prinsip kami</p>
    <h2>Teman yang membantu memilih hadiah.</h2>
    <div class="grid">
      <div class="card"><b>Simpel</b><p>Tidak perlu paham cara kerja marketplace untuk memesan.</p></div>
      <div class="card"><b>Tepercaya</b><p>Partner terverifikasi, transaksi via platform, komplain dimediasi.</p></div>
      <div class="card"><b>Emosional</b><p>Setiap produk untuk momen penting — kartu ucapan adalah intinya.</p></div>
      <div class="card"><b>Transparan</b><p>Tahu siapa yang merangkai dan uangmu di tahap mana.</p></div>
      <div class="card"><b>Manusiawi</b><p>Bicara dengan manusia lewat chat, bukan tiket tanpa wajah.</p></div>
      <div class="card"><b>Premium</b><p>Fotografi produk jujur + foto QC sebelum kirim.</p></div>
    </div>
  </section>

  <section class="band cta">
    <div class="container narrow">
      <h2>Punya usaha bunga? Tumbuh bersama kami.</h2>
      <p>Dapatkan order konsisten, kelola katalog & settlement dalam satu dashboard. Pendaftaran gratis, verifikasi oleh admin.</p>
      <p><a class="btn btn-primary" href={base + 'partner/#/daftar'} data-od-id="tentang-join">Daftar sebagai partner →</a>
      <a class="btn" href="#/partner">Lihat direktori partner</a></p>
      <p class="note">Butuh bantuan? Masuk lalu buka <a class="link-more" href="#/pesan">Pesan & bantuan</a> — admin merespons 1×24 jam.</p>
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
