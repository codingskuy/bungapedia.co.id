<!-- Halaman Stok Live — meniru product-listing ori: utility bar, filter,
     shipping bar, grid/list, stepper + Add, pagination, shipping-date modal. -->
<script lang="ts">
  import { PRODUCTS, SHIP_METHODS, rp } from '../data';
  import { addToCart, ensureCartTimer, showToast, cartDeadline } from '../store';

  let fCat = 'Semua Kategori';
  let fColor = 'Semua Warna';
  let fMarket = 'Semua Kebun';
  let fQuery = '';
  let shipDate = 'Sel, 16 Sep 2026';
  let shipMethod = SHIP_METHODS[1];
  let bunchMode = true;
  let view: 'grid' | 'list' = 'grid';
  let page = 1;
  let showDateModal = true;
  const PER_PAGE = 8;
  const qty: Record<string, number> = {};

  $: cats = ['Semua Kategori', ...new Set(PRODUCTS.map((p) => p.cat))];
  $: colors = ['Semua Warna', ...new Set(PRODUCTS.map((p) => p.color))];
  $: markets = ['Semua Kebun', ...new Set(PRODUCTS.map((p) => p.market))];
  $: filtered = PRODUCTS.filter(
    (p) =>
      (fCat === 'Semua Kategori' || p.cat === fCat) &&
      (fColor === 'Semua Warna' || p.color === fColor) &&
      (fMarket === 'Semua Kebun' || p.market === fMarket) &&
      (p.name + ' ' + p.cat).toLowerCase().includes(fQuery.trim().toLowerCase())
  );
  $: pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  $: page = Math.min(page, pages);
  $: visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // cart timer 90 menit
  let remain = '';
  function tick() {
    if ($cartDeadline == null) { remain = '90:00'; return; }
    const s = Math.max(0, Math.floor(($cartDeadline - Date.now()) / 1000));
    remain = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }
  setInterval(tick, 1000);
  tick();

  function q(id: string, step: number) {
    return qty[id] ?? step;
  }
  function stepQ(id: string, d: number, step: number) {
    qty[id] = Math.max(step, (qty[id] ?? step) + d * step);
  }
  function add(p: (typeof PRODUCTS)[number]) {
    addToCart({ id: p.id, name: p.name, img: p.img, price: p.price, unit: '/' + p.unit }, q(p.id, p.step));
    ensureCartTimer();
    showToast(`${p.name} ×${q(p.id, p.step)} masuk keranjang`);
  }
</script>

<div class="container shop" data-od-id="shop-page">
  <!-- utility bar -->
  <div class="shop-util">
    <button class="toggle" class:on={bunchMode} on:click={() => (bunchMode = !bunchMode)} aria-pressed={bunchMode} data-od-id="shop-bunch-toggle">
      <span class="knob"></span> Belanja per {bunchMode ? 'Ikat' : 'Tangkai'}
    </button>
    <button class="u-btn" on:click={() => showToast('Masuk untuk mengekspor CSV stok')} data-od-id="shop-export">⤓ Ekspor</button>
    <button class="u-btn" on:click={() => showToast('Wishlist kosong — ketuk ♡ di produk')} data-od-id="shop-wishlist">♡ <span class="pill-n">0</span></button>
    <a class="u-btn cart" href="#/checkout" data-od-id="shop-cart">🛒 <span id="shop-cart-total">Lihat keranjang</span></a>
    <span class="cart-timer" data-od-id="shop-cart-timer">⏱ Timer Keranjang: {remain}</span>
  </div>

  <!-- filter row -->
  <div class="shop-filters">
    <select bind:value={fCat} aria-label="Kategori" data-od-id="shop-fcat">
      {#each cats as c}<option>{c}</option>{/each}
    </select>
    <select bind:value={fColor} aria-label="Warna" data-od-id="shop-fcolor">
      {#each colors as c}<option>{c}</option>{/each}
    </select>
    <select bind:value={fMarket} aria-label="Kebun" data-od-id="shop-fmarket">
      {#each markets as m}<option>{m}</option>{/each}
    </select>
    <input class="fq" type="search" placeholder="Cari di stok…" bind:value={fQuery} aria-label="Cari stok" data-od-id="shop-fquery" />
  </div>

  <!-- shipping bar -->
  <div class="ship-bar" data-od-id="shop-shipbar">
    <span class="ship-date">TANGGAL KIRIM: <b>{shipDate}</b> <button class="mini" on:click={() => (showDateModal = true)}>Ubah</button></span>
    <span class="ship-m">🚚 METODE KIRIM
      <select bind:value={shipMethod} aria-label="Metode kirim">
        {#each SHIP_METHODS as m}<option>{m}</option>{/each}
      </select>
    </span>
    <span class="ship-tools">
      <button class:on={view === 'grid'} on:click={() => (view = 'grid')} aria-label="Tampilan grid">▦</button>
      <button class:on={view === 'list'} on:click={() => (view = 'list')} aria-label="Tampilan list">☰</button>
      <button disabled={page <= 1} on:click={() => (page -= 1)}>‹ Prev</button>
      <span class="pg">Hal {page} dari {pages}</span>
      <button disabled={page >= pages} on:click={() => (page += 1)}>Next ›</button>
    </span>
  </div>

  {#if filtered.length === 0}
    <p class="empty-note">Tidak ada stok cocok filter. <button class="link-more" on:click={() => { fCat = 'Semua Kategori'; fColor = 'Semua Warna'; fMarket = 'Semua Kebun'; fQuery = ''; }}>Reset filter</button></p>
  {:else if view === 'grid'}
    <div class="shop-grid">
      {#each visible as p}
        <article class="shop-card" data-od-id="shop-{p.id}">
          <div class="sc-cat">{p.cat}</div>
          <div class="sc-ph">
            <img src={p.img} alt={p.name} loading="lazy" />
            {#if p.sale}<span class="deal-tag">SALE {p.sale}</span>{/if}
          </div>
          <div class="sc-tx">
            <b>{p.name}</b>
            <span class="sc-meta">{p.cat} | {p.color}</span>
            <span class="stock-pill" class:low={p.stock < 10}>{p.stock} tersedia</span>
            <div class="sc-price">
              {#if p.was}<span class="was">{rp(p.was)}</span>{/if}
              <span class="now">{rp(p.price)}<small>/{p.unit}</small></span>
            </div>
            <div class="sc-row">
              <div class="stepper">
                <button on:click={() => stepQ(p.id, -1, p.step)} aria-label="Kurangi">−</button>
                <b>{q(p.id, p.step)}</b>
                <button on:click={() => stepQ(p.id, 1, p.step)} aria-label="Tambah">+</button>
              </div>
              <button class="btn btn-primary btn-sm" on:click={() => add(p)}>Add</button>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <div class="shop-list">
      {#each visible as p}
        <article class="shop-row" data-od-id="shop-{p.id}">
          <img src={p.img} alt={p.name} loading="lazy" />
          <div class="sl-mid"><b>{p.name}</b><span>{p.cat} | {p.color} | {p.market}</span></div>
          <span class="stock-pill" class:low={p.stock < 10}>{p.stock} tersedia</span>
          <span class="now">{rp(p.price)}<small>/{p.unit}</small></span>
          <div class="stepper">
            <button on:click={() => stepQ(p.id, -1, p.step)} aria-label="Kurangi">−</button>
            <b>{q(p.id, p.step)}</b>
            <button on:click={() => stepQ(p.id, 1, p.step)} aria-label="Tambah">+</button>
          </div>
          <button class="btn btn-primary btn-sm" on:click={() => add(p)}>Add</button>
        </article>
      {/each}
    </div>
  {/if}
</div>

{#if showDateModal}
  <div class="modal open" role="dialog" aria-modal="true" aria-label="Tanggal kirim" data-od-id="shipdate-modal">
    <div class="modal-card" style="text-align:center">
      <h3>Tanggal Kirim</h3>
      <p style="color: var(--muted); font-size: 14px">Perhatian! Kamu akan belanja untuk pengiriman:</p>
      <div class="date-pill">📅 {shipDate}</div>
      <div class="modal-actions" style="flex-direction:column">
        <button class="btn btn-primary" style="justify-content:center" on:click={() => (showDateModal = false)}>OK</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .shop { padding-top: 20px; padding-bottom: 24px; }
  .shop-util { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; font-family: var(--font-ui); }
  .toggle { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--border-strong); background: #fff; border-radius: 999px; padding: 8px 16px 8px 10px; font-size: 13.5px; font-weight: 700; color: var(--ink); }
  .toggle .knob { width: 34px; height: 20px; border-radius: 999px; background: #d1d5db; position: relative; transition: background 0.15s; }
  .toggle .knob::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: left 0.15s; }
  .toggle.on .knob { background: var(--accent); }
  .toggle.on .knob::after { left: 16px; }
  .u-btn { border: 1px solid var(--border-strong); background: #fff; color: var(--ink); border-radius: 999px; padding: 9px 16px; font-size: 13.5px; font-weight: 600; text-decoration: none; }
  .u-btn:hover { border-color: var(--ink); }
  .pill-n { background: var(--danger); color: #fff; border-radius: 999px; font-size: 11px; padding: 1px 7px; }
  .cart-timer { margin-left: auto; font-size: 13.5px; font-weight: 700; color: var(--accent-dark); border: 1px dashed var(--accent); border-radius: 999px; padding: 8px 16px; font-variant-numeric: tabular-nums; }
  .shop-filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
  .shop-filters select, .shop-filters .fq, .ship-m select { border: 1px solid var(--border-strong); border-radius: 10px; padding: 10px 12px; font-size: 13.5px; font-family: var(--font-ui); background: #fff; color: var(--ink); }
  .shop-filters .fq { flex: 1; min-width: 160px; }
  .ship-bar { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 10px 16px; margin-bottom: 18px; font-family: var(--font-ui); font-size: 13px; }
  .ship-date b { color: var(--ink); }
  .mini { border: 0; background: none; color: var(--accent-dark); font-weight: 700; font-size: 12.5px; text-decoration: underline; }
  .ship-m { display: flex; align-items: center; gap: 8px; color: var(--muted); font-weight: 700; font-size: 12px; letter-spacing: 0.04em; }
  .ship-tools { margin-left: auto; display: flex; align-items: center; gap: 8px; }
  .ship-tools button { border: 1px solid var(--border-strong); background: #fff; border-radius: 8px; padding: 7px 12px; font-size: 13px; font-weight: 600; color: var(--ink); }
  .ship-tools button.on { background: var(--ink); color: #fff; border-color: var(--ink); }
  .ship-tools button:disabled { opacity: 0.4; }
  .pg { font-size: 12.5px; color: var(--muted); white-space: nowrap; }
  .shop-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .shop-card { background: #fff; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; font-family: var(--font-ui); display: flex; flex-direction: column; }
  .sc-cat { font-size: 11.5px; font-weight: 700; color: var(--muted); padding: 12px 14px 0; }
  .sc-ph { position: relative; aspect-ratio: 1/1; background: #efe9dc; margin: 8px 14px 0; border-radius: 10px; overflow: hidden; }
  .sc-ph img { width: 100%; height: 100%; object-fit: cover; }
  .sc-tx { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
  .sc-tx b { font-size: 13.5px; color: var(--ink); }
  .sc-meta { font-size: 12px; color: var(--muted); }
  .stock-pill { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: var(--accent-dark); background: var(--accent-soft); border-radius: 999px; padding: 3px 10px; }
  .stock-pill.low { color: var(--danger); background: #fdeee9; }
  .sc-price { display: flex; align-items: baseline; gap: 8px; margin-top: 2px; }
  .was { text-decoration: line-through; color: var(--muted); font-size: 13px; }
  .now { font-weight: 800; color: var(--ink); font-size: 16.5px; }
  .now small { font-weight: 500; color: var(--muted); font-size: 12px; }
  .sc-row { display: flex; gap: 8px; margin-top: 8px; }
  .stepper { display: flex; align-items: center; gap: 10px; border: 1px solid var(--border-strong); border-radius: 10px; padding: 4px 8px; }
  .stepper button { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--border-strong); background: #fff; font-size: 14px; line-height: 1; }
  .stepper b { font-size: 13.5px; min-width: 20px; text-align: center; }
  .shop-list { display: flex; flex-direction: column; gap: 10px; }
  .shop-row { display: flex; align-items: center; gap: 14px; background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 10px 16px 10px 10px; font-family: var(--font-ui); }
  .shop-row img { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; }
  .sl-mid { flex: 1; }
  .sl-mid b { display: block; font-size: 14px; color: var(--ink); }
  .sl-mid span { font-size: 12.5px; color: var(--muted); }
  .date-pill { background: var(--accent-soft); color: var(--accent-dark); font-weight: 800; font-size: 17px; border-radius: 12px; padding: 12px; margin: 6px 0 4px; }
  @media (max-width: 960px) {
    .shop-grid { grid-template-columns: 1fr 1fr; }
    .cart-timer { margin-left: 0; }
    .shop-row { flex-wrap: wrap; }
  }
</style>
