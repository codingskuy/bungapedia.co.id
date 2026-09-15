<!-- Minta Penawaran (halaman) — meniru request-a-quote ori. -->
<script lang="ts">
  let sent = false;
  function submit(e: Event) {
    e.preventDefault();
    sent = true;
  }
</script>

<div class="container narrow page" data-od-id="quote-page">
  {#if !sent}
    <p class="eyebrow">Wedding & event</p>
    <h1>Minta penawaran event</h1>
    <p class="lede">Ceritakan tanggal, venue & jumlah tamu — daftar belanja lengkap + harga terkunci dalam 1×24 jam.</p>
    <form class="qform" on:submit={submit}>
      <div class="row">
        <div><label for="qq-name">Nama & usaha</label><input id="qq-name" required placeholder="cth. Rina — Rina Florist, Bandung" /></div>
        <div><label for="qq-wa">No. WhatsApp</label><input id="qq-wa" required inputmode="tel" placeholder="08…" /></div>
      </div>
      <div class="row">
        <div><label for="qq-date">Tanggal event</label><input id="qq-date" type="date" required /></div>
        <div><label for="qq-city">Kota kirim</label><input id="qq-city" required placeholder="cth. Jakarta Selatan" /></div>
      </div>
      <label for="qq-type">Jenis kebutuhan</label>
      <select id="qq-type"><option>Wedding / hajatan</option><option>Korporat & dekor kantor</option><option>Stok toko rutin</option><option>Pre-book musim</option></select>
      <label for="qq-msg">Detail kebutuhan</label>
      <textarea id="qq-msg" rows="4" placeholder="Jenis bunga, warna, jumlah, budget per meja…"></textarea>
      <button type="submit" class="btn btn-primary big">Kirim permintaan →</button>
    </form>
  {:else}
    <div class="done">
      <div class="check">✓</div>
      <h1>Permintaan terkirim!</h1>
      <p class="lede">Tim Bungapedia menghubungimu dalam 1×24 jam dengan daftar belanja & harga terkunci.</p>
      <p><a class="btn btn-primary" href="#/stok">Sambil menunggu, lihat Stok Live →</a></p>
    </div>
  {/if}
</div>

<style>
  .page { padding-top: 32px; padding-bottom: 48px; }
  .narrow { max-width: 720px; }
  .page h1 { font-family: var(--font-display); color: var(--ink); font-size: clamp(28px, 3.6vw, 38px); margin: 6px 0 10px; }
  .lede { color: var(--muted); line-height: 1.65; margin-bottom: 20px; }
  .qform { font-family: var(--font-ui); }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .qform label { display: block; font-size: 13px; font-weight: 700; color: var(--ink); margin: 14px 0 6px; }
  .qform input, .qform select, .qform textarea { width: 100%; border: 1px solid var(--border-strong); border-radius: 10px; padding: 12px 14px; font-size: 14px; font-family: var(--font-ui); color: var(--ink); background: #fff; }
  .big { width: 100%; justify-content: center; margin-top: 22px; padding: 14px; font-size: 15px; }
  .done { text-align: center; padding: 24px 0; }
  .check { width: 64px; height: 64px; border-radius: 50%; background: var(--accent-soft); color: var(--accent-dark); font-size: 30px; font-weight: 800; display: grid; place-items: center; margin: 0 auto 16px; }
  @media (max-width: 640px) { .row { grid-template-columns: 1fr; } }
</style>
