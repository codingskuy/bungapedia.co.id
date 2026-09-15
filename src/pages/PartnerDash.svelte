<!-- Partner Dashboard — PRD §17-19 / prompt §13-16. Demo "masuk sebagai" + kelola order + produk + wallet. -->
<script lang="ts">
  import { CATEGORIES, OCCASIONS, PARTNERS, STATUS_LABEL, partnerById, rp } from '../market-data';
  import {
    NEXT_LABEL,
    advanceOrder,
    cancelOrder,
    orders,
    partnerAccept,
    withdrawSettlement,
  } from '../market-store';
  import { catalog, flagOf, netOf, partnerFlags, partnerKpis, removeProduct, toggleAvailable, upsertProduct } from '../ops-store';
  import type { MarketProduct } from '../market-types';

  let pid = 'pt-flower-house';
  let tab: 'ringkas' | 'pesanan' | 'produk' | 'wallet' = 'ringkas';
  $: pt = partnerById(pid);
  $: kpis = partnerKpis(pid);
  $: os = [] as import('../market-types').Order[];
  $: orders.subscribe((v) => (os = v.filter((o) => o.partnerId === pid)))();
  $: mine = [] as MarketProduct[];
  $: catalog.subscribe((v) => (mine = v.filter((p) => p.partnerId === pid)))();

  // form produk
  let fid: string | null = null;
  let fname = '';
  let fprice: number | '' = '';
  let fcat = CATEGORIES[2];
  let focc = OCCASIONS[0];
  let ferr = '';
  const SAMPLE_IMGS = [...new Set($catalog.map((p) => p.img))].slice(0, 6);
  let fimg = SAMPLE_IMGS[0] ?? '';

  function editStart(p: MarketProduct) {
    fid = p.id; fname = p.name; fprice = p.price; fcat = p.category; focc = p.occasions[0] ?? OCCASIONS[0]; fimg = p.img; ferr = '';
  }
  function formReset() { fid = null; fname = ''; fprice = ''; fcat = CATEGORIES[2]; focc = OCCASIONS[0]; ferr = ''; }
  function saveProduct() {
    if (fname.trim().length < 4) { ferr = 'Nama produk minimal 4 karakter.'; return; }
    if (!fprice || Number(fprice) < 50000) { ferr = 'Harga minimal Rp50.000.'; return; }
    const id = fid ?? `prd-${Date.now().toString(36)}`;
    upsertProduct({
      id, name: fname.trim(), slug: fname.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      partnerId: pid, price: Number(fprice), category: fcat, occasions: [focc], recipients: ['Teman'],
      rating: fid ? (mine.find((m) => m.id === fid)?.rating ?? 5) : 5,
      reviews: fid ? (mine.find((m) => m.id === fid)?.reviews ?? 0) : 0,
      img: fimg, gallery: [fimg], description: 'Ditambahkan via dashboard partner (dummy).',
      materials: 'Campuran segar', size: 'Standar', productionTime: pt.productionTime,
      deliveryArea: pt.area, deliveryEstimate: 'Same-day', available: true, reviewSnippets: [],
    });
    formReset();
  }
  $: flag = (() => { let f = { verified: false, suspended: false }; partnerFlags.subscribe((m) => { f = m[pid] ?? f; })(); return f; })();
</script>

<div class="container dash" data-od-id="partner-dash">
  <p class="eyebrow">Partner dashboard · simulasi self-service</p>
  <div class="dhead">
    <div>
      <h1>Halo, {pt.name} {#if flag.verified}<span class="vbadge">✓ Verified</span>{/if}</h1>
      <p class="lede">Terima order, update produksi, kelola katalog & pantau settlement — tanpa backend.</p>
    </div>
    <label class="as">Masuk sebagai
      <select bind:value={pid}>{#each PARTNERS as p}<option value={p.id}>{p.name} · {flagOf(p.id).suspended ? 'suspended' : 'aktif'}</option>{/each}</select>
    </label>
  </div>

  <nav class="tabs" aria-label="Menu partner">
    {#each [['ringkas', 'Ringkasan'], ['pesanan', `Pesanan (${os.length})`], ['produk', `Produk (${mine.length})`], ['wallet', 'Wallet']] as [k, l]}
      <button class:on={tab === k} on:click={() => (tab = k)}>{l}</button>
    {/each}
  </nav>

  {#if tab === 'ringkas'}
    <div class="kpis">
      <div class="kpi"><span>Pesanan baru</span><b>{$kpis.fresh}</b><small>perlu Accept</small></div>
      <div class="kpi"><span>Aktif</span><b>{$kpis.active}</b><small>dikerjakan</small></div>
      <div class="kpi"><span>Selesai</span><b>{$kpis.done}</b><small>completed</small></div>
      <div class="kpi"><span>Revenue</span><b>{rp($kpis.revenue)}</b><small>fee {rp($kpis.fee)}</small></div>
      <div class="kpi hot"><span>Pending settlement</span><b>{rp($kpis.pending)}</b><small>cair setelah konfirmasi</small></div>
      <div class="kpi ok"><span>Available</span><b>{rp($kpis.available)}</b><small>siap withdraw</small></div>
    </div>
    <div class="card"><h3>Alur kerja hari ini</h3>
      {#if os.filter((o) => o.status === 'paid').length === 0}
        <p class="mut">Tidak ada pesanan baru. Coba buat pesanan customer dulu, lalu bayar — order akan muncul di sini.</p>
      {:else}
        {#each os.filter((o) => o.status === 'paid') as o}
          <div class="orow"><img src={o.items[0].img} alt="" /><div><b>{o.id} · {o.items[0].name}</b><small>{o.recipient.name} · kirim {o.delivery.date}</small></div>
          <button class="btn btn-primary btn-sm" on:click={() => partnerAccept(o.id)}>Accept</button>
          <button class="btn btn-sm" on:click={() => cancelOrder(o.id)}>Reject</button></div>
        {/each}
      {/if}
    </div>
  {:else if tab === 'pesanan'}
    <div class="card">
      <h3>Kelola pesanan</h3>
      {#if os.length === 0}
        <p class="mut">Belum ada order untuk partner ini. Ganti “masuk sebagai” atau buat pesanan baru.</p>
      {:else}
        {#each os as o}
          <div class="orow big">
            <img src={o.items[0].img} alt={o.items[0].name} />
            <div><b>{o.id} · {STATUS_LABEL[o.status]}</b>
              <small>{o.items[0].name} ×{o.items[0].qty} · {rp(o.total)} · settlement {o.settlement.toUpperCase()}</small>
              <small>“{o.message}” — {o.recipient.name}, {o.delivery.date} {o.delivery.time}</small></div>
            <div class="acts">
              {#if o.status === 'paid'}<button class="btn btn-primary btn-sm" on:click={() => partnerAccept(o.id)}>Accept</button>{/if}
              {#if NEXT_LABEL[o.status]}<button class="btn btn-primary btn-sm" on:click={() => advanceOrder(o.id)}>{NEXT_LABEL[o.status]}</button>{/if}
              {#if !['completed', 'cancelled'].includes(o.status)}<button class="btn btn-sm" on:click={() => cancelOrder(o.id)}>Batalkan</button>{/if}
              <a class="btn btn-sm" href="#/lacak/{o.id}">Lihat tracking</a>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {:else if tab === 'produk'}
    <div class="cols">
      <div class="card">
        <h3>Katalog saya ({mine.length})</h3>
        {#each mine as p}
          <div class="orow"><img src={p.img} alt={p.name} /><div><b>{p.name}</b><small>{p.category} · {rp(p.price)} · {p.available ? 'tersedia' : 'nonaktif'}</small></div>
            <div class="acts">
              <button class="btn btn-sm" on:click={() => editStart(p)}>Edit</button>
              <button class="btn btn-sm" on:click={() => toggleAvailable(p.id)}>{p.available ? 'Nonaktifkan' : 'Aktifkan'}</button>
              <button class="btn btn-sm danger" on:click={() => removeProduct(p.id)}>Hapus</button>
            </div>
          </div>
        {/each}
      </div>
      <div class="card">
        <h3>{fid ? 'Edit produk' : 'Tambah produk'}</h3>
        {#if ferr}<div class="err">{ferr}</div>{/if}
        <label>Nama<input placeholder="cth. Buket Wisuda Pastel" bind:value={fname} /></label>
        <div class="row"><div><label>Harga<input type="number" min="50000" step="5000" bind:value={fprice} /></label></div>
        <div><label>Kategori<select bind:value={fcat}>{#each CATEGORIES as c}<option>{c}</option>{/each}</select></label></div></div>
        <label>Momen utama<select bind:value={focc}>{#each OCCASIONS as o}<option>{o}</option>{/each}</select></label>
        <label>Foto (dari stok harvest)<select bind:value={fimg}>{#each SAMPLE_IMGS as s}<option value={s}>{s.split('/').pop()?.slice(0, 24)}…</option>{/each}</select></label>
        <div class="acts"><button class="btn btn-primary" on:click={saveProduct}>Simpan → katalog</button>
        {#if fid}<button class="btn" on:click={formReset}>Batal</button>{/if}</div>
        <p class="mut">Produk baru butuh approval admin di produksi nyata (PRD §18) — di prototype langsung tayang agar bisa didemo.</p>
      </div>
    </div>
  {:else}
    <div class="kpis">
      <div class="kpi"><span>Total sales</span><b>{rp($kpis.revenue + $kpis.fee)}</b><small>bruto</small></div>
      <div class="kpi"><span>Platform fee (10%)</span><b>{rp($kpis.fee)}</b><small>pendapatan platform</small></div>
      <div class="kpi ok"><span>Partner revenue</span><b>{rp($kpis.revenue - $kpis.fee)}</b><small>bersih estimasi</small></div>
    </div>
    <div class="card"><h3>Status settlement</h3>
      <div class="kpis three">
        <div class="kpi hot"><span>Pending</span><b>{rp($kpis.pending)}</b></div>
        <div class="kpi ok"><span>Available</span><b>{rp($kpis.available)}</b></div>
        <div class="kpi"><span>Withdrawn</span><b>{rp($kpis.withdrawn)}</b></div>
      </div>
      <button class="btn btn-primary" on:click={() => withdrawSettlement(pid)}>Cairkan yang Available (simulasi)</button>
      {#each os.filter((o) => o.paymentStatus === 'paid') as o}
        <div class="orow"><div><b>{o.id}</b><small>Customer {rp(o.total)} · fee {rp(Math.round(o.productTotal * 0.1))} · bersih {rp(netOf(o.productTotal))}</small></div>
        <span class="pill">{o.settlement.toUpperCase()}</span></div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .dash { padding: 28px 24px 48px; max-width: 1120px; margin: 0 auto; font-family: var(--font-ui); }
  h1 { font-family: var(--font-display); color: var(--ink); margin: 6px 0 6px; font-size: clamp(26px,3.4vw,36px); }
  .lede { color: var(--muted); } .dhead { display: flex; gap: 18px; align-items: end; justify-content: space-between; flex-wrap: wrap; }
  .as { font-size: 13px; font-weight: 700; color: var(--ink); } .as select { display: block; margin-top: 6px; border: 1px solid var(--border-strong); border-radius: 10px; padding: 10px 12px; }
  .vbadge { background: var(--accent-soft); color: var(--accent-dark); font-size: 12px; padding: 3px 10px; border-radius: 999px; }
  .tabs { display: flex; gap: 8px; margin: 20px 0 16px; flex-wrap: wrap; }
  .tabs button { border: 1px solid var(--border-strong); background: #fff; border-radius: 999px; padding: 9px 18px; font-weight: 700; font-size: 13.5px; color: var(--ink); }
  .tabs button.on { background: var(--ink); color: #fff; border-color: var(--ink); }
  .kpis { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 16px; }
  .kpis.three { grid-template-columns: repeat(3, 1fr); }
  .kpi { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; }
  .kpi span { font-size: 12px; color: var(--muted); } .kpi b { display: block; font-size: 20px; color: var(--ink); margin: 4px 0 2px; } .kpi small { font-size: 12px; color: var(--muted); }
  .kpi.hot b { color: var(--danger); } .kpi.ok b { color: var(--accent-dark); }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 20px 22px; margin-bottom: 14px; }
  .card h3 { font-family: var(--font-display); color: var(--ink); margin: 0 0 12px; }
  .orow { display: flex; gap: 12px; align-items: center; padding: 10px 0; border-top: 1px solid var(--border); }
  .orow img { width: 52px; height: 52px; border-radius: 10px; object-fit: cover; flex: none; }
  .orow small { color: var(--muted); display: block; font-size: 12.5px; } .orow.big { align-items: flex-start; }
  .acts { margin-left: auto; display: flex; gap: 8px; flex-wrap: wrap; justify-content: end; }
  .danger { color: var(--danger); border-color: var(--danger); }
  .cols { display: grid; grid-template-columns: 1.2fr .8fr; gap: 14px; align-items: start; }
  label { display: block; font-size: 13px; font-weight: 700; color: var(--ink); margin: 10px 0 6px; }
  input, select { width: 100%; border: 1px solid var(--border-strong); border-radius: 10px; padding: 10px 12px; font-size: 14px; font-family: var(--font-ui); }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; } .err { background: #fdeee9; color: #8f2d17; border-radius: 10px; padding: 10px 12px; font-size: 13px; }
  .mut { color: var(--muted); font-size: 13.5px; line-height: 1.6; } .pill { font-size: 11px; font-weight: 800; background: var(--accent-soft); color: var(--accent-dark); border-radius: 999px; padding: 4px 10px; }
  @media (max-width: 960px) { .kpis { grid-template-columns: 1fr 1fr 1fr; } .cols { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { .kpis, .kpis.three { grid-template-columns: 1fr 1fr; } .row { grid-template-columns: 1fr; } }
</style>
