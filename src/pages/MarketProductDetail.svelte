<!-- PDP marketplace — Visual → Produk → Harga → Partner → Trust → CTA -->
<script lang="ts">
  import { partnerById, productsByPartner, rp } from '../market-data';
  import { addMarketToCart, clearError, raiseError, toggleWishlist, wishlist } from '../market-store';
  import type { MarketProduct } from '../market-types';
  export let product: MarketProduct | undefined;
  export let notFoundId = '';

  $: pt = product ? partnerById(product.partnerId) : null;
  $: siblings = product ? productsByPartner(product.partnerId).filter((p) => p.id !== product!.id).slice(0, 3) : [];
  let qty = 1;
  let activeImg = 0;
  $: if (product) { activeImg = 0; qty = 1; clearError(); }
  $: if (!product) raiseError('pdp-missing', `Produk "${notFoundId || 'tanpa ID'}" tidak tersedia.`, 'Pilih produk lain dari katalog — semua link PDP kini tervalidasi.');

  function buyNow() {
    if (!product) return;
    if (addMarketToCart(product, qty)) location.hash = '#/checkout';
  }
</script>

{#if product && pt}
<div class="container pdp" data-od-id="pdp-{product.id}">
  <nav class="crumb"><a href="#/">Beranda</a> / <a href="#/produk">Katalog</a> / <span>{product.name}</span></nav>
  <div class="pdp-grid">
    <div>
      <div class="gallery"><img src={product.gallery[activeImg]} alt={product.name} /></div>
      <div class="thumbs">
        {#each product.gallery as g, i}
          <button class:on={i === activeImg} on:click={() => (activeImg = i)} aria-label="Foto {i + 1}"><img src={g} alt="" /></button>
        {/each}
      </div>
      <div class="desc-card">
        <h3>Detail rangkaian</h3>
        <p>{product.description}</p>
        <dl>
          <div><dt>Material</dt><dd>{product.materials}</dd></div>
          <div><dt>Ukuran</dt><dd>{product.size}</dd></div>
          <div><dt>Produksi</dt><dd>{product.productionTime}</dd></div>
          <div><dt>Area kirim</dt><dd>{product.deliveryArea.join(', ')}</dd></div>
        </dl>
      </div>
      <div class="desc-card">
        <h3>Ulasan ({product.reviews})</h3>
        {#each product.reviewSnippets as r}
          <div class="rev"><b>{r.name} · {'★'.repeat(r.rating)}</b><p>{r.text}</p></div>
        {/each}
      </div>
    </div>
    <div>
      <div class="buy-card">
        <p class="eyebrow">{product.category} · {product.occasions.slice(0, 2).join(' · ')}</p>
        <h1>{product.name}</h1>
        <div class="rate">★ {product.rating} <span>({product.reviews} ulasan)</span> {#if product.popular}<span class="flag-pop">Populer</span>{/if}</div>
        <div class="price">{#if product.was}<span class="was">{rp(product.was)}</span>{/if}<b>{rp(product.price)}</b></div>
        <div class="qty-row">
          <div class="stepper"><button on:click={() => (qty = Math.max(1, qty - 1))} aria-label="Kurangi">−</button><b>{qty}</b><button on:click={() => (qty += 1)} aria-label="Tambah">+</button></div>
          <span class="est">{product.deliveryEstimate}</span>
        </div>
        <button class="btn btn-primary big" on:click={buyNow} data-od-id="pdp-buy">Pesan Sekarang →</button>
        <div class="row2">
          <button class="btn" style="flex:1;justify-content:center" on:click={() => addMarketToCart(product, qty)}>+ Keranjang</button>
          <button class="btn" class:on={$wishlist.includes(product.id)} on:click={() => toggleWishlist(product.id)} aria-label="Wishlist">{$wishlist.includes(product.id) ? '♥' : '♡'}</button>
        </div>
        <div class="trust-mini">
          <span>🛡 Transaksi via platform</span><span>📍 {product.deliveryArea[0]}</span><span>⏱ {product.productionTime}</span>
        </div>
      </div>
      <a class="partner-card" href="#/partner/{pt.id}" data-od-id="pdp-partner">
        <img src={pt.logo} alt={pt.name} />
        <div><span class="lbl">Dibuat oleh</span><b>{pt.name} {#if pt.verified}<span class="vbadge">✓ Verified Partner</span>{/if}</b>
        <small>★ {pt.rating} · {(pt.orders / 1000).toFixed(1)}K order · respon {pt.responseRate}%</small></div>
        <span class="go">→</span>
      </a>
      {#if siblings.length}
        <div class="sib"><h3>Lainnya dari {pt.name}</h3>
          {#each siblings as s}<a href="#/produk/{s.id}"><img src={s.img} alt={s.name} /><span><b>{s.name}</b><small>{rp(s.price)}</small></span></a>{/each}
        </div>
      {/if}
    </div>
  </div>
</div>
{/if}

<style>
  .pdp { padding: 24px 24px 48px; max-width: 1180px; margin: 0 auto; font-family: var(--font-ui); }
  .crumb { font-size: 13px; color: var(--muted); margin-bottom: 16px; } .crumb a { color: var(--accent-dark); text-decoration: none; }
  .pdp-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 24px; align-items: start; }
  .pdp h1 { font-family: var(--font-display); color: var(--ink); font-size: clamp(26px,3vw,36px); margin: 4px 0 8px; }
  .gallery { border-radius: 18px; overflow: hidden; background: #efe9dc; } .gallery img { width: 100%; height: 440px; object-fit: cover; }
  .thumbs { display: flex; gap: 10px; margin: 12px 0 18px; } .thumbs button { border: 2px solid transparent; border-radius: 10px; overflow: hidden; padding: 0; width: 84px; height: 64px; } .thumbs button.on { border-color: var(--accent); } .thumbs img { width: 100%; height: 100%; object-fit: cover; }
  .desc-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 20px 22px; margin-bottom: 14px; }
  .desc-card h3 { font-family: var(--font-display); color: var(--ink); margin: 0 0 8px; } .desc-card p { color: #4b5563; line-height: 1.65; font-size: 14.5px; }
  dl div { display: grid; grid-template-columns: 110px 1fr; gap: 10px; padding: 7px 0; border-top: 1px solid var(--border); font-size: 13.5px; } dt { color: var(--muted); } dd { margin: 0; color: var(--ink); font-weight: 600; }
  .rev { border-top: 1px solid var(--border); padding: 10px 0; font-size: 14px; } .rev p { margin: 4px 0 0; color: #4b5563; }
  .buy-card { background: #fff; border: 1px solid var(--border); border-radius: 18px; padding: 24px; position: sticky; top: 130px; }
  .rate { font-size: 14px; color: var(--ink); font-weight: 700; } .rate span { color: var(--muted); font-weight: 500; } .flag-pop { background: var(--ink); color: #fff; font-size: 11px; padding: 3px 9px; border-radius: 999px; }
  .price { display: flex; gap: 10px; align-items: baseline; margin: 10px 0 14px; } .was { text-decoration: line-through; color: var(--muted); } .price b { font-size: 28px; color: var(--ink); }
  .qty-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; } .est { font-size: 13px; color: var(--accent-dark); font-weight: 700; }
  .stepper { display: flex; align-items: center; gap: 12px; border: 1px solid var(--border-strong); border-radius: 999px; padding: 6px 12px; } .stepper button { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border-strong); background: #fff; }
  .big { width: 100%; justify-content: center; padding: 14px; font-size: 15.5px; } .row2 { display: flex; gap: 10px; margin-top: 10px; } .row2 .on { border-color: var(--danger); color: var(--danger); }
  .trust-mini { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 14px; font-size: 12.5px; color: var(--muted); }
  .partner-card { display: flex; gap: 12px; align-items: center; background: var(--accent-soft); border: 1px solid #d8e6c6; border-radius: 16px; padding: 14px 16px; margin-top: 14px; text-decoration: none; color: var(--ink); }
  .partner-card img { width: 52px; height: 52px; border-radius: 12px; object-fit: cover; } .partner-card .lbl { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--accent-dark); font-weight: 800; display: block; } .partner-card small { color: var(--muted); display: block; } .go { margin-left: auto; font-size: 20px; }
  .vbadge { background: #fff; color: var(--accent-dark); font-size: 11px; padding: 2px 8px; border-radius: 999px; font-weight: 800; }
  .sib { margin-top: 14px; background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 16px; } .sib h3 { margin: 0 0 10px; font-size: 15px; } .sib a { display: flex; gap: 10px; align-items: center; text-decoration: none; color: var(--ink); padding: 8px 0; border-top: 1px solid var(--border); } .sib img { width: 52px; height: 52px; border-radius: 10px; object-fit: cover; } .sib small { display: block; color: var(--muted); }
  @media (max-width: 960px) { .pdp-grid { grid-template-columns: 1fr; } .buy-card { position: static; } .gallery img { height: 300px; } }
</style>
