<!-- Portal Partner (bungapedia.co.id/partner) — login wall → dashboard milik partner yang login. -->
<script lang="ts">
  import './app.css';
  import { logout, sessionPartner } from './auth';
  import { partnerById } from './market-data';
  import Login from './pages/Login.svelte';
  import PartnerDash from './pages/PartnerDash.svelte';

  const base = import.meta.env.BASE_URL;
  $: me = $sessionPartner;
  $: pt = me?.partnerId ? partnerById(me.partnerId) : null;
</script>

<div class="topbar" data-od-id="topbar">Portal Partner Bungapedia · kelola order, katalog & settlement</div>

<header class="site-header scrolled" data-od-id="portal-header">
  <div class="header-inner">
    <a class="logo" href={base} aria-label="Kembali ke Bungapedia"><span class="logo-mark">✿</span>
      <span class="logo-word">Bungapedia<small>portal partner</small></span></a>
    <div class="header-actions">
      {#if me}
        <span class="who">Halo, <b>{me.name}</b></span>
        <button class="btn btn-sm" on:click={() => logout('partner')}>Keluar</button>
      {:else}
        <a class="btn btn-sm" href={base}>← Ke situs utama</a>
      {/if}
    </div>
  </div>
</header>

<main>
  {#if !me}
    <div class="container gate">
      <div class="gate-copy">
        <p class="eyebrow">Untuk florist & penyedia jasa</p>
        <h1>Dapatkan order konsisten, kelola dalam satu tempat.</h1>
        <p class="lede">Terima pesanan, update produksi, atur katalog, dan pantau settlement — tanpa sistem manual. Masuk dengan akun demo partnermu.</p>
        <ul class="ticks"><li>✓ Notifikasi pesanan baru</li><li>✓ Settlement transparan per order</li><li>✓ Katalog live ke situs customer</li></ul>
        <p><a class="link-more" href={base}>← Lihat situs customer dulu</a></p>
      </div>
      <Login role="partner" title="Masuk Partner" on:success={() => window.scrollTo(0, 0)} />
    </div>
  {:else if pt}
    <PartnerDash fixedId={pt.id} />
  {/if}
</main>

<footer class="site-footer" data-od-id="portal-footer">
  <div class="footer-inner">
    <div class="footer-bottom" style="border:0;margin:0;padding:0">
      <span>© 2026 Bungapedia · Portal Partner (prototype — data dummy)</span>
      <a href={base} style="color:#fff">← bungapedia.co.id</a>
    </div>
  </div>
</footer>

<style>
  .who { font-family: var(--font-ui); font-size: 14px; color: var(--ink); }
  .gate { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center; max-width: 1120px; margin: 0 auto; padding: 24px; font-family: var(--font-ui); }
  .gate h1 { font-family: var(--font-display); color: var(--ink); font-size: clamp(30px,4vw,46px); margin: 6px 0 12px; line-height: 1.1; }
  .lede { color: var(--muted); line-height: 1.65; }
  .ticks { list-style: none; margin: 16px 0; padding: 0; display: flex; flex-direction: column; gap: 8px; font-size: 14.5px; color: var(--ink); font-weight: 600; }
  @media (max-width: 900px) { .gate { grid-template-columns: 1fr; } }
</style>
