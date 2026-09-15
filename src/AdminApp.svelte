<!-- Portal Admin (bungapedia.co.id/admin) — login wall → dashboard owner. -->
<script lang="ts">
  import './app.css';
  import { logout, sessionAdmin } from './auth';
  import Login from './pages/Login.svelte';
  import AdminDash from './pages/AdminDash.svelte';

  const base = import.meta.env.BASE_URL;
  $: me = $sessionAdmin;
</script>

<div class="topbar" data-od-id="topbar">Portal Owner Bungapedia · area terbatas</div>

<header class="site-header scrolled" data-od-id="portal-header">
  <div class="header-inner">
    <a class="logo" href={base} aria-label="Kembali ke Bungapedia"><span class="logo-mark">✿</span>
      <span class="logo-word">Bungapedia<small>portal owner</small></span></a>
    <div class="header-actions">
      {#if me}
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
  {:else}
    <AdminDash />
  {/if}
</main>

<footer class="site-footer" data-od-id="portal-footer">
  <div class="footer-inner">
    <div class="footer-bottom" style="border:0;margin:0;padding:0">
      <span>© 2026 Bungapedia · Portal Owner (prototype — data dummy)</span>
      <a href={base} style="color:#fff">← bungapedia.co.id</a>
    </div>
  </div>
</footer>

<style>
  .who { font-family: var(--font-ui); font-size: 14px; color: var(--ink); }
  .gate { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center; max-width: 1120px; margin: 0 auto; padding: 24px; font-family: var(--font-ui); }
  .gate h1 { font-family: var(--font-display); color: var(--ink); font-size: clamp(30px,4vw,46px); margin: 6px 0 12px; line-height: 1.1; }
  .lede { color: var(--muted); line-height: 1.65; }
  .warn { background: #fff8e6; border: 1px solid #ecd27a; border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #6b4e0c; }
  @media (max-width: 900px) { .gate { grid-template-columns: 1fr; } }
</style>
