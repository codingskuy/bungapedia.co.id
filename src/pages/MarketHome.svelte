<!-- Home khusus customer login — rapat ala marketplace: promo, pil kategori,
     strip tab, grid produk + pesanan aktif. Tamu tetap melihat homepage editorial. -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { CATEGORIES, STATUS_LABEL, deliveryTone, rp } from '../market-data';
  import { sessionCustomer } from '../auth';
  import { addMarketToCart, orders, toggleWishlist, wishlist } from '../market-store';
  import { catalog } from '../ops-store';

  $: me = $sessionCustomer;
  $: myOrders = (() => {
    let os: import('../market-types').Order[] = [];
    orders.subscribe((v) => (os = v))();
    if (!me) return [];
    return os.filter((o) => o.customerId === me!.customerId || o.customerName === me!.name);
  })();
  $: activeOrders = myOrders.filter((o) => !['completed', 'cancelled'].includes(o.status)).slice(0, 3);
  $: deals = $catalog.filter((p) => p.was && p.available).slice(0, 4);
  let tab = 'Semua';
  $: grid = (tab === 'Semua' ? $catalog : $catalog.filter((p) => p.category === tab)).filter((p) => p.available);

  function goCat(c: string) {
    try {
      sessionStorage.setItem('bp-cat', c);
    } catch { /* abaikan */ }
    location.hash = '#/produk';
  }

  // hitung mundur penawaran s.d. tengah malam
  let left = '';
  function tick() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const s = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
    left = `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }
  onMount(() => {
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  });
</script>

<div class="mhome" data-od-id="home-member">
  <a class="promo" href="#/produk" data-od-id="home-promo">
    <div><b>Same-day untuk momen hari ini</b><span>Pesan sebelum 15:00 — foto QC sebelum dikirim</span></div>
    <span class="promo-cta">Lihat penawaran →</span>
  </a>

  {#if activeOrders.length > 0}
    <section>
      <div class="shead"><h2>Lanjutkan pesananmu</h2><a class="link-more" href="#/pesanan">Semua →</a></div>
      <div class="orow-wrap">
        {#each activeOrders as o}
          <a class="orow" href={o.paymentStatus === 'unpaid' ? `#/bayar/${o.id}` : `#/lacak/${o.id}`}>
            <img src={o.items[0].img} alt={o.items[0].name} />
            <div><b>{o.items[0].name}</b><small>{STATUS_LABEL[o.status]} · {rp(o.total)}</small></div>
            <span>→</span>
          </a>
        {/each}
      </div>
    </section>
  {/if}

  <section>
    <div class="shead"><h2>Penawaran berakhir {left}</h2><a class="link-more" href="#/produk">Semua →</a></div>
    <div class="deal-strip">
      {#each deals as p}
        {@const tone = deliveryTone(p.deliveryEstimate)}
        <article class="dcard" data-od-id="deal-{p.id}">
          <a href="#/produk/{p.id}"><img src={p.img} alt={p.name} loading="lazy" /><span class="off">−{Math.round((1 - p.price / (p.was ?? p.price)) * 100)}%</span></a>
          <div class="tx"><a href="#/produk/{p.id}">{p.name}</a>
            <div class="pr">{#if p.was}<s>{rp(p.was)}</s>{/if}<b>{rp(p.price)}</b></div>
            <div class="meta-row"><span class="badge-delivery {tone}"><span class="dot"></span>{p.deliveryEstimate}</span><small>★ {p.rating}</small></div>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section>
    <div class="shead"><h2>Belanja</h2></div>
    <div class="pills" role="tablist" aria-label="Kategori">
      <button class:on={tab === 'Semua'} on:click={() => (tab = 'Semua')}>Untukmu</button>
      {#each CATEGORIES as c}
        <button class:on={tab === c} on:click={() => (tab = c)}>{c}</button>
      {/each}
    </div>
    <div class="pills sub">
      {#each CATEGORIES as c}<button on:click={() => goCat(c)}>{c} →</button>{/each}
    </div>
    <div class="grid">
      {#each grid as p}
        {@const t = deliveryTone(p.deliveryEstimate)}
        <article class="gcard" data-od-id="home-{p.id}">
          <a href="#/produk/{p.id}"><img src={p.img} alt={p.name} loading="lazy" /></a>
          <div class="tx">
            <a class="nm ptitle-2" href="#/produk/{p.id}">{p.name}</a>
            <b>{rp(p.price)}</b>
            <small>★ {p.rating} · {p.reviews} ulasan</small>
            <div class="pt"><span class="badge-delivery {t}"><span class="dot"></span>{p.deliveryEstimate}</span></div>
            <div class="row">
              <button class="btn btn-primary btn-sm" on:click={() => addMarketToCart(p)}>+ Keranjang</button>
              <button class="btn btn-sm" class:on={$wishlist.includes(p.id)} on:click={() => toggleWishlist(p.id)} aria-label="Wishlist">{$wishlist.includes(p.id) ? '♥' : '♡'}</button>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </section>
</div>

<style>
  .mhome { max-width: 1180px; margin: 0 auto; padding: 20px 24px 48px; font-family: var(--font-ui); display: flex; flex-direction: column; gap: 26px; }
  .greet { display: flex; align-items: end; justify-content: space-between; gap: 16px; }
  .hsearch { display: flex; gap: 10px; margin-top: 10px; max-width: 560px; }
  .hsearch input { flex: 1; border: 1px solid var(--border-strong); border-radius: 999px; padding: 12px 18px; font-size: 14.5px; font-family: var(--font-ui); }
  .mini-orders { font-size: 13.5px; font-weight: 700; color: var(--accent-dark); text-decoration: none; white-space: nowrap; }
  .promo { display: flex; align-items: center; justify-content: space-between; gap: 16px; border-radius: 18px; padding: 26px 30px; text-decoration: none; color: #fff; background: linear-gradient(120deg, var(--brand-deep), var(--accent-dark) 60%, var(--accent)); }
  .promo b { display: block; font-family: var(--font-display); font-size: clamp(20px,2.6vw,28px); }
  .promo span { font-size: 13.5px; opacity: .9; }
  .promo-cta { background: #fff; color: var(--ink); font-weight: 800; font-size: 14px; border-radius: 999px; padding: 11px 22px; white-space: nowrap; }
  section h2 { font-size: 19px; color: var(--ink); margin: 0; }
  .shead { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .orow-wrap { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .orow { display: flex; gap: 10px; align-items: center; background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 10px; text-decoration: none; color: var(--ink); }
  .orow img { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; } .orow small { color: var(--muted); display: block; font-size: 12px; }
  .deal-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .dcard { background: #fff; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .dcard > a { position: relative; display: block; aspect-ratio: 1; background: #efe9dc; }
  .dcard img { width: 100%; height: 100%; object-fit: cover; }
  .off { position: absolute; top: 8px; left: 8px; background: var(--danger); color: #fff; font-size: 11px; font-weight: 800; border-radius: 6px; padding: 3px 7px; }
  .dcard .tx { padding: 10px 12px 12px; display:flex; flex-direction:column; gap:4px; } .dcard .tx a { color: var(--ink); font-size: 13px; font-weight: 700; text-decoration: none; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pr { display: flex; gap: 6px; align-items: baseline; margin-top: 2px; } .pr s { color: var(--muted); font-size: 11.5px; } .pr b { font-size: 14.5px; }
  .dcard small { color: var(--muted); font-size: 11.5px; } .meta-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
  .pills { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 8px; }
  .pills button { flex: none; border: 0; background: none; font-size: 14px; font-weight: 600; color: var(--muted); padding: 8px 4px; border-bottom: 2px solid transparent; }
  .pills button.on { color: var(--accent-dark); border-bottom-color: var(--accent); }
  .pills.sub button { border: 1px solid var(--border-strong); background: #fff; border-radius: 999px; padding: 8px 16px; font-size: 13px; color: var(--ink); }
  .grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
  .gcard { background: #fff; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
  .gcard > a { display: block; aspect-ratio: 1; background: #efe9dc; } .gcard img { width: 100%; height: 100%; object-fit: cover; }
  .gcard .tx { padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 3px; flex: 1; }
  .nm { font-size: 13px; font-weight: 600; color: var(--ink); text-decoration: none; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .gcard b { font-size: 14.5px; } .gcard small { color: var(--muted); font-size: 11.5px; } .pt { display:flex; margin-top:2px; }
  .row { display: flex; gap: 6px; margin-top: auto; padding-top: 6px; } .row .btn { flex: 1; justify-content: center; padding: 8px 6px; font-size: 12.5px; }
  .row .btn.on { border-color: var(--danger); color: var(--danger); }
  @media (max-width: 1100px) { .grid { grid-template-columns: repeat(4, 1fr); } }
  @media (max-width: 800px) { .grid, .deal-strip { grid-template-columns: 1fr 1fr; } .orow-wrap { grid-template-columns: 1fr; } .greet { flex-direction: column; align-items: stretch; } }
</style>
