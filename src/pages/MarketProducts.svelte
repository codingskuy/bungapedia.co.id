<!-- Katalog marketplace — discovery by momen + penerima (diferensiasi PRD §12/23). -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { CATEGORIES, OCCASIONS, RECIPIENTS, PARTNERS, partnerById, rp } from '../market-data';
  import { catalog, partnerFlags } from '../ops-store';
  import { addMarketToCart, catalogQuery, wishlist, toggleWishlist } from '../market-store';

  let cat = 'Semua';
  let occasion = 'Semua';
  let recipient = 'Semua';
  let partner = 'Semua';
  let sort: 'populer' | 'termurah' | 'termahal' | 'rating' = 'populer';
  let onlyVerified = false;
  let maxPrice = 650000;

  // Prefilter dari home member (pil kategori / pencarian) via sessionStorage
  onMount(() => {
    try {
      const c = sessionStorage.getItem('bp-cat');
      if (c && (CATEGORIES as string[]).includes(c)) cat = c;
      sessionStorage.removeItem('bp-cat');
      const kw = sessionStorage.getItem('bp-q');
      if (kw) catalogQuery.set(kw);
      sessionStorage.removeItem('bp-q');
    } catch { /* abaikan */ }
  });

  $: filtered = $catalog.filter((p) => {
    const pt = partnerById(p.partnerId);
    if ($partnerFlags[p.partnerId]?.suspended) return false;
    if (!p.available) return false;
    if (cat !== 'Semua' && p.category !== cat) return false;
    if (occasion !== 'Semua' && !p.occasions.includes(occasion)) return false;
    if (recipient !== 'Semua' && !p.recipients.includes(recipient)) return false;
    if (partner !== 'Semua' && pt.name !== partner) return false;
    if (onlyVerified && !pt.verified) return false;
    if (p.price > maxPrice) return false;
    if ($catalogQuery.trim() && !(p.name + ' ' + p.category + ' ' + pt.name).toLowerCase().includes($catalogQuery.trim().toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'termurah') return a.price - b.price;
    if (sort === 'termahal') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.reviews - a.reviews;
  });

  function reset() {
    catalogQuery.set(''); cat = 'Semua'; occasion = 'Semua'; recipient = 'Semua'; partner = 'Semua';
    sort = 'populer'; onlyVerified = false; maxPrice = 650000;
  }
</script>

<div class="container mkt-page" data-od-id="produk-page">
  <p class="eyebrow">Katalog · {filtered.length} produk dari {PARTNERS.length} partner</p>
  <h1>Cari berdasar momen, bukan sekadar kategori.</h1>
  <p class="lede">Setiap kartu menunjukkan siapa partner-nya — karena kamu membeli dari platform, tapi diyakinkan oleh partner.</p>

  <div class="filter-card" data-od-id="produk-filter">
    <div class="frow">
      <input class="fq" type="search" placeholder="Cari “buket wisuda”, “papan opening”… " bind:value={$catalogQuery} aria-label="Cari produk" />
      <select bind:value={sort} aria-label="Urutkan">
        <option value="populer">Paling populer</option>
        <option value="rating">Rating tertinggi</option>
        <option value="termurah">Termurah</option>
        <option value="termahal">Termahal</option>
      </select>
    </div>
    <div class="frow wrap">
      <select bind:value={cat} aria-label="Kategori"><option>Semua</option>{#each CATEGORIES as c}<option>{c}</option>{/each}</select>
      <select bind:value={occasion} aria-label="Momen"><option>Semua</option>{#each OCCASIONS as o}<option>{o}</option>{/each}</select>
      <select bind:value={recipient} aria-label="Penerima"><option>Semua</option>{#each RECIPIENTS as r}<option>{r}</option>{/each}</select>
      <select bind:value={partner} aria-label="Partner"><option>Semua</option>{#each PARTNERS as p}<option>{p.name}</option>{/each}</select>
    </div>
    <div class="frow wrap small">
      <label class="check"><input type="checkbox" bind:checked={onlyVerified} /> Verified saja</label>
      <label class="range">Maks {rp(maxPrice)} <input type="range" min={130000} max={650000} step={10000} bind:value={maxPrice} /></label>
      <button class="link-more" on:click={reset}>Reset filter</button>
    </div>
  </div>

  {#if filtered.length === 0}
    <div class="empty" data-od-id="produk-empty">
      <b>Tidak ada produk cocok filter.</b>
      <p>Coba longgarkan momen atau naikkan batas harga. Contoh: “Wisuda” + maks Rp400rb.</p>
      <button class="btn btn-primary" on:click={reset}>Reset filter</button>
    </div>
  {:else}
    <div class="mkt-grid">
      {#each filtered as p}
        {@const pt = partnerById(p.partnerId)}
        <article class="mkt-card" data-od-id="mkt-{p.id}">
          <a class="ph" href="#/produk/{p.id}"><img src={p.img} alt={p.name} loading="lazy" />
            {#if p.popular}<span class="flag-pop">Populer</span>{/if}
            {#if p.was}<span class="flag-sale">−{Math.round((1 - p.price / p.was) * 100)}%</span>{/if}
          </a>
          <div class="tx">
            <a class="nm ptitle-2" href="#/produk/{p.id}">{p.name}</a>
            <div class="price">{#if p.was}<span class="was">{rp(p.was)}</span>{/if}<b>{rp(p.price)}</b></div>
            <a class="pt-line" href="#/partner/{pt.id}">
              {#if pt.verified}<span class="vbadge">✓ Verified</span>{/if}
              <span class="pt-name">{pt.name}</span><span class="dot">·</span><span>★ {pt.rating} ({pt.reviews})</span>
            </a>
            <div class="meta">{p.deliveryEstimate} · {p.deliveryArea[0]}</div>
            <div class="row">
              <button class="btn btn-primary btn-sm" on:click={() => addMarketToCart(p)}>+ Keranjang</button>
              <button class="btn btn-sm" class:on={$wishlist.includes(p.id)} on:click={() => toggleWishlist(p.id)} aria-label="Wishlist">{$wishlist.includes(p.id) ? '♥' : '♡'}</button>
              <a class="btn btn-sm" href="#/produk/{p.id}">Detail</a>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>

<style>
  .mkt-page { padding: 28px 24px 48px; max-width: 1180px; margin: 0 auto; font-family: var(--font-ui); }
  .mkt-page h1 { font-family: var(--font-display); color: var(--ink); font-size: clamp(28px,3.6vw,40px); margin: 6px 0 8px; }
  .lede { color: var(--muted); max-width: 64ch; line-height: 1.65; }
  .filter-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 16px; margin: 20px 0; display: flex; flex-direction: column; gap: 12px; }
  .frow { display: flex; gap: 10px; } .frow.wrap { flex-wrap: wrap; } .frow.small { align-items: center; color: var(--muted); font-size: 13px; }
  .fq { flex: 1; min-width: 200px; border: 1px solid var(--border-strong); border-radius: 10px; padding: 11px 14px; font-size: 14px; }
  select { border: 1px solid var(--border-strong); border-radius: 10px; padding: 11px 12px; font-size: 13.5px; background: #fff; color: var(--ink); }
  .check { display: flex; gap: 8px; align-items: center; font-weight: 600; color: var(--ink); }
  .range { display: flex; gap: 10px; align-items: center; }
  .mkt-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .mkt-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
  .ph { position: relative; aspect-ratio: 4/3; background: #efe9dc; display: block; }
  .ph img { width: 100%; height: 100%; object-fit: cover; }
  .flag-pop { position: absolute; top: 10px; left: 10px; background: var(--ink); color: #fff; font-size: 11px; font-weight: 800; padding: 5px 10px; border-radius: 999px; }
  .flag-sale { position: absolute; top: 10px; right: 10px; background: var(--danger); color: #fff; font-size: 11px; font-weight: 800; padding: 5px 10px; border-radius: 999px; }
  .tx { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
  .nm { font-weight: 800; color: var(--ink); text-decoration: none; font-size: 15px; }
  .nm:hover { text-decoration: underline; }
  .price { display: flex; gap: 8px; align-items: baseline; } .was { text-decoration: line-through; color: var(--muted); font-size: 13px; } .price b { font-size: 17px; }
  .pt-line { display: flex; gap: 6px; align-items: center; font-size: 12.5px; color: var(--muted); text-decoration: none; white-space: nowrap; overflow: hidden; }
  .pt-line .pt-name { overflow: hidden; text-overflow: ellipsis; }
  .vbadge { background: var(--accent-soft); color: var(--accent-dark); font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 999px; }
  .pt-name { font-weight: 700; color: var(--ink); } .dot { opacity: .5; }
  .meta { font-size: 12.5px; color: var(--muted); }
  .row { display: flex; gap: 8px; margin-top: auto; padding-top: 8px; } .btn-sm { flex: 1; justify-content: center; } .btn-sm.on { border-color: var(--danger); color: var(--danger); }
  .empty { text-align: center; background: #fff; border: 1px dashed var(--border-strong); border-radius: 16px; padding: 40px 24px; }
  .empty p { color: var(--muted); }
  @media (max-width: 960px) { .mkt-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 640px) { .mkt-grid { grid-template-columns: 1fr; } .frow { flex-direction: column; } }
</style>
