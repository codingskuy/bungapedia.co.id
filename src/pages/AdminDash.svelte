<!-- Admin / Owner Dashboard — PRD §20-23 / prompt §17-21. Satu layar kondisi bisnis + transaksi + settlement + dispute. -->
<script lang="ts">
  import { CUSTOMERS, PARTNERS, STATUS_LABEL, partnerById, rp } from '../market-data';
  import { orders, resolveDispute } from '../market-store';
  import { adminStats, catalog, netOf, partnerFlags, resetOps, setSuspended, setVerified } from '../ops-store';
  import type { Order } from '../market-types';

  let tab: 'ringkas' | 'transaksi' | 'partner' | 'settlement' | 'komplain' = 'ringkas';
  $: os = [] as Order[];
  $: orders.subscribe((v) => (os = v))();
  let selected: string | null = null;
  $: detail = selected ? os.find((o) => o.id === selected) : null;
  $: disputes = os.filter((o) => o.status === 'disputed');
  $: revByPartner = PARTNERS.map((p) => ({
    p,
    rev: os.filter((o) => o.partnerId === p.id && o.paymentStatus === 'paid' && o.status !== 'cancelled').reduce((n, o) => n + o.productTotal, 0),
    n: os.filter((o) => o.partnerId === p.id).length,
  }));
  $: flags = {} as Record<string, { verified: boolean; suspended: boolean }>;
  $: partnerFlags.subscribe((v) => (flags = v))();
</script>

<div class="container dash" data-od-id="admin-dash">
  <p class="eyebrow">Admin / Owner · monitoring operasional</p>
  <div class="dhead"><div><h1>Kondisi bisnis sekilas</h1><p class="lede">GMV, revenue, settlement & dispute — tanpa klaim escrow legal, murni visualisasi konsep.</p></div>
  <button class="btn btn-sm" on:click={resetOps}>Reset demo ops</button></div>

  <nav class="tabs" aria-label="Menu admin">
    {#each [['ringkas', 'Ringkasan'], ['transaksi', `Transaksi (${os.length})`], ['partner', `Partner (${PARTNERS.length})`], ['settlement', 'Settlement'], ['komplain', `Dispute (${disputes.length})`]] as [k, l]}
      <button class:on={tab === k} on:click={() => (tab = k)}>{l}</button>
    {/each}
  </nav>

  {#if tab === 'ringkas'}
    <div class="kpis">
      <div class="kpi"><span>GMV</span><b>{rp($adminStats.gmv)}</b><small>paid orders</small></div>
      <div class="kpi ok"><span>Platform revenue</span><b>{rp($adminStats.revenue)}</b><small>fee terkumpul</small></div>
      <div class="kpi"><span>Orders</span><b>{$adminStats.orders}</b><small>{$adminStats.active} aktif</small></div>
      <div class="kpi"><span>Customers</span><b>{CUSTOMERS.length}+guest</b><small>dummy</small></div>
      <div class="kpi"><span>Partners</span><b>{PARTNERS.length}</b><small>{Object.values(flags).filter((f) => f.verified).length} verified</small></div>
      <div class="kpi hot"><span>Pending settlement</span><b>{rp($adminStats.pendingSettlement)}</b><small>milik partner</small></div>
      <div class="kpi danger"><span>Disputes</span><b>{$adminStats.disputes}</b><small>perlu mediasi</small></div>
      <div class="kpi"><span>Katalog</span><b>{$catalog.length}</b><small>produk live</small></div>
    </div>
    <div class="card"><h3>Antrian perhatian</h3>
      {#if disputes.length === 0 && $adminStats.active === 0}
        <p class="mut">Semua beres. Tidak ada dispute terbuka maupun order aktif.</p>
      {:else}
        {#each disputes as d}<div class="orow"><div><b>{d.id} · {d.dispute?.reason}</b><small>{d.customerName} × {partnerById(d.partnerId).name} · {rp(d.total)}</small></div>
          <button class="btn btn-sm" on:click={() => { tab = 'komplain'; selected = d.id; }}>Mediasi →</button></div>{/each}
        {#each os.filter((o) => o.status === 'paid').slice(0, 3) as o}<div class="orow"><div><b>{o.id} menunggu partner</b><small>{partnerById(o.partnerId).name} belum Accept</small></div></div>{/each}
      {/if}
    </div>
  {:else if tab === 'transaksi'}
    <div class="cols">
      <div class="card"><h3>Semua transaksi</h3>
        {#each os as o}
          <button class="orow pick" class:on={selected === o.id} on:click={() => (selected = o.id)} data-od-id="adm-{o.id}">
            <div><b>{o.id} · {STATUS_LABEL[o.status]}</b><small>{o.customerName} × {partnerById(o.partnerId).name} · {o.items[0].name}</small></div>
            <b>{rp(o.total)}</b>
          </button>
        {/each}
      </div>
      <div class="card">
        {#if detail}
          {@const pt = partnerById(detail.partnerId)}
          <h3>{detail.id}</h3>
          <dl>
            <div><dt>Customer</dt><dd>{detail.customerName} · {detail.recipient.phone}</dd></div>
            <div><dt>Partner</dt><dd>{pt.name}</dd></div>
            <div><dt>Produk</dt><dd>{detail.items.map((i) => `${i.name} ×${i.qty}`).join(', ')}</dd></div>
            <div><dt>Amount</dt><dd>{rp(detail.total)} (produk {rp(detail.productTotal)} + ongkir {rp(detail.deliveryFee)} + fee {rp(detail.platformFee)})</dd></div>
            <div><dt>Payment</dt><dd>{detail.paymentStatus.toUpperCase()} · {detail.paymentMethod}</dd></div>
            <div><dt>Order</dt><dd>{STATUS_LABEL[detail.status]}</dd></div>
            <div><dt>Settlement</dt><dd>{detail.settlement.toUpperCase()} · bersih partner {rp(netOf(detail.productTotal))}</dd></div>
            <div><dt>Pesan</dt><dd>“{detail.message}”</dd></div>
          </dl>
          <a class="btn btn-sm" href="#/lacak/{detail.id}">Buka tracking customer →</a>
        {:else}<p class="mut">Pilih transaksi untuk melihat detail.</p>{/if}
      </div>
    </div>
  {:else if tab === 'partner'}
    <div class="card"><h3>Verifikasi & performa partner</h3>
      {#each revByPartner as { p, rev, n }}
        {@const f = flags[p.id] ?? { verified: false, suspended: false }}
        <div class="orow big">
          <div><b>{p.name}</b> {#if f.verified}<span class="pill ok">Verified</span>{:else}<span class="pill hot">Belum verifikasi</span>{/if}
          {#if f.suspended}<span class="pill danger">Suspended</span>{/if}
          <small>{n} order · revenue {rp(rev)} · ★ {p.rating} · {p.city}</small></div>
          <div class="acts">
            {#if !f.verified}<button class="btn btn-primary btn-sm" on:click={() => setVerified(p.id, true)}>Verify</button>
            {:else}<button class="btn btn-sm" on:click={() => setVerified(p.id, false)}>Cabut</button>{/if}
            {#if !f.suspended}<button class="btn btn-sm danger" on:click={() => setSuspended(p.id, true)}>Suspend</button>
            {:else}<button class="btn btn-sm" on:click={() => setSuspended(p.id, false)}>Aktifkan</button>{/if}
            <a class="btn btn-sm" href="#/partner/{p.id}">Profil →</a>
          </div>
        </div>
      {/each}
      <p class="mut">Suspend menyembunyikan produk partner dari katalog customer secara live.</p>
    </div>
  {:else if tab === 'settlement'}
    <div class="card"><h3>Visualisasi konsep settlement</h3>
      <div class="flow">
        <span>Customer bayar</span>→<span>Platform catat</span>→<span class="hl">Pending settlement {rp($adminStats.pendingSettlement)}</span>→<span>Order completed</span>→<span>Fee platform {rp($adminStats.revenue)}</span>→<span class="hl">Partner terima bersih</span>
      </div>
      {#each revByPartner as { p, rev }}
        {@const mine = os.filter((o) => o.partnerId === p.id && o.paymentStatus === 'paid' && o.status !== 'cancelled')}
        <div class="orow"><div><b>{p.name}</b><small>Pending {rp(mine.filter((o) => o.settlement === 'pending').reduce((n, o) => n + netOf(o.productTotal), 0))} · Available {rp(mine.filter((o) => o.settlement === 'available').reduce((n, o) => n + netOf(o.productTotal), 0))} · Withdrawn {rp(mine.filter((o) => o.settlement === 'withdrawn').reduce((n, o) => n + netOf(o.productTotal), 0))}</small></div>
        <b>{rp(netOf(rev))}</b></div>
      {/each}
      <p class="mut">MVP: jangan menyimpan dana secara mandiri — gunakan payment provider. Angka di sini dihitung live dari store orders.</p>
    </div>
  {:else}
    <div class="cols">
      <div class="card"><h3>Antrian dispute ({disputes.length})</h3>
        {#if disputes.length === 0}<p class="mut">Nihil. Contoh seed: INV-2026-009 (warna tidak sesuai).</p>{/if}
        {#each disputes as d}<button class="orow pick" class:on={selected === d.id} on:click={() => (selected = d.id)}>
          <div><b>{d.id} · {d.dispute?.reason}</b><small>{d.customerName} × {partnerById(d.partnerId).name} · {rp(d.total)} · {d.dispute?.status}</small></div></button>{/each}
      </div>
      <div class="card">
        {#if detail && detail.status === 'disputed'}
          <h3>Mediasi {detail.id}</h3>
          <p><b>Issue:</b> {detail.dispute?.reason}</p>
          <p><b>Customer:</b> {detail.customerName} · <b>Partner:</b> {partnerById(detail.partnerId).name} · <b>Amount:</b> {rp(detail.total)}</p>
          <div class="acts">
            <button class="btn btn-sm" on:click={() => resolveDispute(detail.id, 'refund')}>Refund customer</button>
            <button class="btn btn-primary btn-sm" on:click={() => resolveDispute(detail.id, 'release')}>Release ke partner</button>
            <button class="btn btn-sm" on:click={() => resolveDispute(detail.id, 'reject')}>Tolak komplain</button>
          </div>
          <p class="mut">MVP: semua manual oleh admin. Keputusan menulis status order + settlement secara live.</p>
        {:else}<p class="mut">Pilih dispute untuk memediasi.</p>{/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .dash { padding: 28px 24px 48px; max-width: 1120px; margin: 0 auto; font-family: var(--font-ui); }
  h1 { font-family: var(--font-display); color: var(--ink); margin: 6px 0 6px; font-size: clamp(26px,3.4vw,36px); }
  .lede { color: var(--muted); } .dhead { display: flex; justify-content: space-between; align-items: end; gap: 14px; flex-wrap: wrap; }
  .tabs { display: flex; gap: 8px; margin: 20px 0 16px; flex-wrap: wrap; }
  .tabs button { border: 1px solid var(--border-strong); background: #fff; border-radius: 999px; padding: 9px 18px; font-weight: 700; font-size: 13.5px; color: var(--ink); }
  .tabs button.on { background: var(--ink); color: #fff; border-color: var(--ink); }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
  .kpi { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; }
  .kpi span { font-size: 12px; color: var(--muted); } .kpi b { display: block; font-size: 20px; color: var(--ink); margin: 4px 0 2px; } .kpi small { font-size: 12px; color: var(--muted); }
  .kpi.hot b { color: var(--danger); } .kpi.ok b { color: var(--accent-dark); } .kpi.danger b { color: var(--danger); }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 20px 22px; margin-bottom: 14px; }
  .card h3 { font-family: var(--font-display); color: var(--ink); margin: 0 0 12px; }
  .orow { display: flex; gap: 12px; align-items: center; padding: 10px 0; border-top: 1px solid var(--border); width: 100%; background: none; border-left: 0; border-right: 0; border-bottom: 0; text-align: left; font-family: var(--font-ui); color: var(--ink); }
  .orow small { color: var(--muted); display: block; font-size: 12.5px; } .orow.big { align-items: flex-start; }
  .pick { cursor: pointer; border-radius: 8px; } .pick:hover { background: var(--bg); } .pick.on { background: var(--accent-soft); }
  .acts { margin-left: auto; display: flex; gap: 8px; flex-wrap: wrap; justify-content: end; }
  .danger { color: var(--danger); border-color: var(--danger); }
  .pill { font-size: 11px; font-weight: 800; border-radius: 999px; padding: 3px 10px; background: var(--bg); color: var(--muted); }
  .pill.ok { background: var(--accent-soft); color: var(--accent-dark); } .pill.hot { background: #fdeee9; color: #8f2d17; } .pill.danger { background: #8f2d17; color: #fff; }
  .cols { display: grid; grid-template-columns: 1.1fr .9fr; gap: 14px; align-items: start; }
  dl div { display: grid; grid-template-columns: 100px 1fr; gap: 10px; padding: 7px 0; border-top: 1px solid var(--border); font-size: 13.5px; } dt { color: var(--muted); } dd { margin: 0; font-weight: 600; }
  .flow { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 12.5px; font-weight: 700; margin-bottom: 16px; }
  .flow span { background: var(--bg); border: 1px solid var(--border); border-radius: 999px; padding: 7px 13px; }
  .flow .hl { background: var(--accent-soft); border-color: #cfe3b8; color: var(--accent-dark); }
  .mut { color: var(--muted); font-size: 13.5px; line-height: 1.6; }
  @media (max-width: 960px) { .kpis { grid-template-columns: 1fr 1fr; } .cols { grid-template-columns: 1fr; } }
</style>
