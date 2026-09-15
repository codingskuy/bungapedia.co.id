<!-- Portal Admin (bungapedia.co.id/admin) — login wall → dashboard + pesan. -->
<script lang="ts">
  import { onMount } from 'svelte';
  import './app.css';
  import { logout, sessionAdmin } from './auth';
  import { COMPANY_LEGAL } from './market-data';
  import { threads, totalUnread } from './chat-store';
  import Login from './pages/Login.svelte';
  import AdminDash from './pages/AdminDash.svelte';
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
  $: me = $sessionAdmin;
  $: myMe = me ? { role: 'admin' as const, name: me.name } : null;
  $: unread = myMe && $threads ? totalUnread(myMe) : 0;
</script>

<div class="topbar" data-od-id="topbar">Portal Owner Bungapedia · area terbatas</div>

<header class="site-header scrolled" data-od-id="portal-header">
  <div class="header-inner">
    <a class="logo" href={base} aria-label="Kembali ke Bungapedia"><span class="logo-mark">✿</span>
      <span class="logo-word">Bungapedia<small>portal owner</small></span></a>
    <div class="header-actions">
      {#if me}
        <nav class="ptabs" aria-label="Menu owner">
          <a href="#/" class:on={view === ''}>Dashboard</a>
          <a href="#/pesan" class:on={view === 'pesan'}>Pesan{#if unread > 0} <span class="nbadge">{unread}</span>{/if}</a>
        </nav>
        <span class="who">Halo, <b>{me.name}</b></span>
        <button class="btn btn-sm" on:click={() => logout('admin')}>Keluar</button>
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
        <p class="eyebrow">GMV · settlement · dispute</p>
        <h1>Kondisi bisnis dalam satu layar.</h1>
        <p class="lede">Pantau transaksi, verifikasi partner, awasi settlement, dan mediasi dispute. Akses khusus owner & ops.</p>
        <p class="warn">⚠ Prototype validasi — data dummy, tanpa klaim escrow legal.</p>
      </div>
      <Login role="admin" title="Masuk Owner" on:success={() => window.scrollTo(0, 0)} />
    </div>
  {:else if view === 'pesan' && arg}
    {#if myMe}<ChatRoom threadId={arg} me={myMe} />{/if}
  {:else if view === 'pesan'}
    <div class="container wrap">
      <p class="eyebrow">Pesan · semua pihak terjangkau dari sini</p>
      <h1 class="ptitle">Kotak masuk</h1>
      {#if myMe}<ChatList me={myMe} emptyHint="Belum ada percakapan. Buka dari detail transaksi via tombol Chat." />{/if}
    </div>
  {:else}
    <AdminDash />
  {/if}
</main>

<footer class="site-footer" data-od-id="portal-footer">
  <div class="footer-inner">
    <div class="footer-bottom" style="border:0;margin:0;padding:0">
      <span>© 2026 Bungapedia · {COMPANY_LEGAL} · Portal Owner (prototype — data dummy)</span>
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
  .warn { background: #fff8e6; border: 1px solid #ecd27a; border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #6b4e0c; }
  @media (max-width: 900px) { .gate { grid-template-columns: 1fr; } .ptabs { display: none; } }
</style>
