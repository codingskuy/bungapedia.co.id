<!-- Portal Partner (bungapedia.co.id/partner) — login wall → dashboard + pesan + daftar. -->
<script lang="ts">
  import { onMount } from 'svelte';
  import './app.css';
  import { logout, sessionPartner } from './auth';
  import { partnerById, COMPANY_LEGAL } from './market-data';
  import { threads, totalUnread } from './chat-store';
  import Login from './pages/Login.svelte';
  import PartnerDash from './pages/PartnerDash.svelte';
  import PartnerRegister from './pages/PartnerRegister.svelte';
  import ChatList from './pages/ChatList.svelte';
  import ChatRoom from './pages/ChatRoom.svelte';

  const base = import.meta.env.BASE_URL;
  let rawHash = typeof location !== 'undefined' ? location.hash : '';
  function sync() {
    rawHash = location.hash;
    window.scrollTo(0, 0);
  }
  onMount(() => window.addEventListener('hashchange', sync));

  $: seg = rawHash.startsWith('#/') ? rawHash.slice(2).split('/') : [];
  $: view = seg[0] ?? '';
  $: arg = decodeURIComponent(seg[1] ?? '');
  $: me = $sessionPartner;
  $: pt = me?.partnerId ? partnerById(me.partnerId) : null;
  $: myMe = me && me.partnerId ? { role: 'partner' as const, id: me.partnerId, name: me.name } : null;
  $: unread = myMe && $threads ? totalUnread(myMe) : 0;
</script>

<div class="topbar" data-od-id="topbar">Portal Partner Bungapedia · kelola order, katalog & settlement</div>

<header class="site-header scrolled" data-od-id="portal-header">
  <div class="header-inner">
    <a class="logo" href={base} aria-label="Kembali ke Bungapedia"><img class="logo-img" src={base + 'assets/brand/bungapedia-mark.png'} alt="Logo Bungapedia" />
      <span class="logo-word"><span class="wm">Bungapedia</span><small>portal partner</small></span></a>
    <div class="header-actions">
      {#if me}
        <nav class="ptabs" aria-label="Menu partner">
          <a href="#/" class:on={view === ''}>Dashboard</a>
          <a href="#/pesan" class:on={view === 'pesan'}>Pesan{#if unread > 0} <span class="nbadge">{unread}</span>{/if}</a>
        </nav>
        <span class="who">Halo, <b>{me.name}</b></span>
        <button class="btn btn-sm" on:click={() => logout('partner')}>Keluar</button>
      {:else}
        <a class="btn btn-sm" href={base}>← Ke situs utama</a>
      {/if}
    </div>
  </div>
</header>

<main>
  {#if view === 'daftar'}
    {#if me && pt}
      <PartnerDash fixedId={pt.id} />
    {:else}
      <PartnerRegister />
      <p style="text-align:center;font-family:var(--font-ui);font-size:14px">Sudah punya akun? <a class="link-more" href="#/">Masuk di sini →</a></p>
    {/if}
  {:else if !me}
    <div class="container gate">
      <div class="gate-copy">
        <p class="eyebrow">Untuk florist & penyedia jasa</p>
        <h1>Dapatkan order konsisten, kelola dalam satu tempat.</h1>
        <p class="lede">Terima pesanan, update produksi, atur katalog, dan pantau settlement — tanpa sistem manual. Masuk dengan akun demo partnermu.</p>
        <ul class="ticks"><li>✓ Notifikasi pesanan baru</li><li>✓ Settlement transparan per order</li><li>✓ Katalog live ke situs customer</li></ul>
        <p><a class="link-more" href="#/daftar">Belum punya akun? Daftar sebagai partner →</a></p>
      </div>
      <Login role="partner" title="Masuk Partner" on:success={() => window.scrollTo(0, 0)} />
    </div>
  {:else if view === 'pesan' && arg}
    {#if myMe}<ChatRoom threadId={arg} me={myMe} />{/if}
  {:else if view === 'pesan'}
    <div class="container wrap">
      <p class="eyebrow">Pesan · mediasi & operasional</p>
      <h1 class="ptitle">Kotak masuk</h1>
      {#if myMe}<ChatList me={myMe} emptyHint="Belum ada percakapan. Buka dari tab Pesanan via tombol Chat Admin." />{/if}
    </div>
  {:else if pt}
    <PartnerDash fixedId={pt.id} />
  {/if}
</main>

<footer class="site-footer" data-od-id="portal-footer">
  <div class="footer-inner">
    <div class="footer-bottom" style="border:0;margin:0;padding:0">
      <span>© 2026 Bungapedia · {COMPANY_LEGAL} · Portal Partner (prototype — data dummy)</span>
      <a href={base} style="color:#fff">← bungapedia.co.id</a>
    </div>
  </div>
</footer>

<style>
  .who { font-family: var(--font-ui); font-size: 14px; color: var(--ink); }
  .ptabs { display: flex; gap: 4px; font-family: var(--font-ui); }
  .ptabs a { text-decoration: none; font-size: 14px; font-weight: 600; color: var(--ink); padding: 8px 12px; border-radius: 999px; }
  .ptabs a.on { background: var(--ink); color: #fff; }
  .nbadge { background: var(--danger); color: #fff; font-size: 11px; font-weight: 800; min-width: 18px; height: 18px; border-radius: 999px; display: inline-grid; place-items: center; padding: 0 5px; }
  .wrap { max-width: 900px; margin: 0 auto; padding: 28px 24px 48px; }
  .ptitle { font-family: var(--font-display); color: var(--ink); margin: 6px 0 16px; font-size: clamp(26px,3.4vw,36px); }
  .gate { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center; max-width: 1120px; margin: 0 auto; padding: 24px; font-family: var(--font-ui); }
  .gate h1 { font-family: var(--font-display); color: var(--ink); font-size: clamp(30px,4vw,46px); margin: 6px 0 12px; line-height: 1.1; }
  .lede { color: var(--muted); line-height: 1.65; }
  .ticks { list-style: none; margin: 16px 0; padding: 0; display: flex; flex-direction: column; gap: 8px; font-size: 14.5px; color: var(--ink); font-weight: 600; }
  @media (max-width: 900px) { .gate { grid-template-columns: 1fr; } .ptabs { display: none; } }
</style>
