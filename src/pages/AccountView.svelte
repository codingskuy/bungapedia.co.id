<!-- Dashboard customer (bungapedia.co.id → login → navigasi akun). -->
<script lang="ts">
  import { STATUS_LABEL, rp } from '../market-data';
  import { orders } from '../market-store';
  import { logout, sessionCustomer } from '../auth';
  import type { Order } from '../market-types';

  $: me = $sessionCustomer;
  $: os = [] as Order[];
  $: orders.subscribe((v) => (os = v))();
  $: mine = me ? os.filter((o) => o.customerId === me!.customerId || o.customerName === me!.name) : [];
  $: spent = mine.filter((o) => o.status !== 'cancelled').reduce((n, o) => n + o.total, 0);

  function out() {
    logout('customer');
    location.hash = '#/';
  }
</script>

{#if me}
<div class="container acc" data-od-id="akun">
  <p class="eyebrow">Akun saya</p>
  <div class="ahead">
    <div class="avatar">{me.name.slice(0, 1).toUpperCase()}</div>
    <div><h1>Halo, {me.name}</h1><p class="lede">{me.email}</p></div>
    <button class="btn btn-sm" on:click={out}>Keluar</button>
  </div>
  <div class="kpis">
    <div class="kpi"><span>Pesanan</span><b>{mine.length}</b><small>termasuk dummy seed</small></div>
    <div class="kpi"><span>Aktif</span><b>{mine.filter((o) => !['completed', 'cancelled'].includes(o.status)).length}</b><small>perlu perhatian</small></div>
    <div class="kpi"><span>Total belanja</span><b>{rp(spent)}</b><small>di luar yang dibatalkan</small></div>
  </div>
  <div class="card">
    <h3>Pesanan saya</h3>
    {#if mine.length === 0}
      <p class="mut">Belum ada pesanan atas nama {me.name}. Mulai dari katalog — coba “Buket Wisuda → Checkout → Bayar → Lacak”.</p>
      <p><a class="btn btn-primary" href="#/produk">Cari karangan bunga →</a></p>
    {:else}
      {#each mine as o}
        <a class="orow" href={o.paymentStatus === 'unpaid' ? `#/bayar/${o.id}` : `#/lacak/${o.id}`}>
          <img src={o.items[0].img} alt={o.items[0].name} />
          <div><b>{o.id} · {o.items[0].name}</b><small>{STATUS_LABEL[o.status]} · {rp(o.total)}</small></div>
          <span class="go">→</span>
        </a>
      {/each}
    {/if}
  </div>
  <div class="row2">
    <a class="btn" style="flex:1;justify-content:center" href="#/wishlist">♥ Wishlist saya</a>
    <a class="btn" style="flex:1;justify-content:center" href="#/produk">+ Belanja lagi</a>
  </div>
</div>
{/if}

<style>
  .acc { padding: 28px 24px 48px; max-width: 900px; margin: 0 auto; font-family: var(--font-ui); }
  h1 { font-family: var(--font-display); color: var(--ink); margin: 0; font-size: clamp(26px,3.4vw,36px); }
  .lede { color: var(--muted); margin: 4px 0 0; }
  .ahead { display: flex; gap: 14px; align-items: center; margin-bottom: 18px; }
  .avatar { width: 56px; height: 56px; border-radius: 50%; background: var(--accent); color: #fff; font-size: 24px; font-weight: 800; display: grid; place-items: center; flex: none; }
  .ahead .btn { margin-left: auto; }
  .kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
  .kpi { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; }
  .kpi span { font-size: 12px; color: var(--muted); } .kpi b { display: block; font-size: 20px; color: var(--ink); margin: 4px 0 2px; } .kpi small { font-size: 12px; color: var(--muted); }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 20px 22px; }
  .card h3 { font-family: var(--font-display); color: var(--ink); margin: 0 0 10px; }
  .orow { display: flex; gap: 12px; align-items: center; padding: 10px 0; border-top: 1px solid var(--border); text-decoration: none; color: var(--ink); }
  .orow img { width: 52px; height: 52px; border-radius: 10px; object-fit: cover; }
  .orow small { color: var(--muted); display: block; } .go { margin-left: auto; }
  .mut { color: var(--muted); font-size: 14px; line-height: 1.65; }
  .row2 { display: flex; gap: 10px; margin-top: 14px; }
  @media (max-width: 640px) { .kpis { grid-template-columns: 1fr; } .row2 { flex-direction: column; } }
</style>
