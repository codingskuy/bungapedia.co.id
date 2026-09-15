<!-- Prebook: kalender + penjelasan, CTA amankan slot. -->
<script lang="ts">
  import { PREBOOK } from '../data';
  import { showToast } from '../store';
</script>

<div class="container page" data-od-id="prebook-page">
  <p class="eyebrow">Kalender pre-book</p>
  <h1>Pesan jauh hari, hemat lebih banyak.</h1>
  <p class="lede">Kunci harga & alokasi untuk puncak musim bunga Indonesia. Pre-book melindungimu dari lonjakan harga pasar — deposit 30%, pelunasan H-7.</p>
  <div class="prebook-grid">
    {#each PREBOOK as p}
      <div class="prebook-card">
        <div><div class="dt">{p.date}</div><b>{p.title} {#if p.hot}<span class="hot-flag">Ramai</span>{/if}</b><small>{p.note}</small></div>
        <button class="btn btn-sm btn-primary" on:click={() => showToast(p.title + ' · slot diamankan, tim kami menghubungimu')}>Amankan</button>
      </div>
    {/each}
  </div>
  <div class="how">
    <div><b>1. Pilih jendela</b><span>Amankan slot musim — tanpa komitmen varietas dulu.</span></div>
    <div><b>2. Kunci varietas H-30</b><span>Tim kurasi mengunci warna & grade dengan kebun.</span></div>
    <div><b>3. Kirim tepat waktu</b><span>Overnight H-1 event, substitusi pre-approved.</span></div>
  </div>
</div>

<style>
  .page { padding-top: 32px; padding-bottom: 40px; }
  .page h1 { font-family: var(--font-display); color: var(--ink); font-size: clamp(28px, 3.6vw, 38px); margin: 6px 0 10px; }
  .lede { color: var(--muted); max-width: 64ch; line-height: 1.65; margin-bottom: 22px; }
  .how { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 26px; font-family: var(--font-ui); }
  .how div { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 18px; }
  .how b { display: block; color: var(--ink); margin-bottom: 4px; }
  .how span { color: var(--muted); font-size: 13.5px; }
  @media (max-width: 960px) { .how { grid-template-columns: 1fr; } }
</style>
