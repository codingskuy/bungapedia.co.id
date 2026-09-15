<!-- Wishlist customer. -->
<script lang="ts">
  import { partnerById, rp } from '../market-data';
  import { addMarketToCart, toggleWishlist, wishlist } from '../market-store';
  import { catalog } from '../ops-store';

  $: items = $catalog.filter((p) => $wishlist.includes(p.id));
</script>

<div class="container wl" data-od-id="wishlist">
  <p class="eyebrow">Wishlist · {items.length} tersimpan</p>
  <h1>Disimpan untuk momen nanti</h1>
  {#if items.length === 0}
    <div class="empty"><b>Wishlist masih kosong.</b><p>Ketuk ♡ di katalog atau PDP untuk menyimpan. Wishlist tersimpan di browser ini.</p>
    <p><a class="btn btn-primary" href="#/produk">Cari produk →</a></p></div>
  {:else}
    <div class="grid">
      {#each items as p}
        {@const pt = partnerById(p.partnerId)}
        <article class="card">
          <a href="#/produk/{p.id}"><img src={p.img} alt={p.name} loading="lazy" /></a>
          <div class="tx"><a class="nm" href="#/produk/{p.id}">{p.name}</a>
            <div class="meta">{pt.name} · ★ {p.rating}</div>
            <b>{rp(p.price)}</b>
            <div class="row">
              <button class="btn btn-primary btn-sm" on:click={() => addMarketToCart(p)}>+ Keranjang</button>
              <button class="btn btn-sm" on:click={() => toggleWishlist(p.id)}>Hapus</button>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>

<style>
  .wl { padding: 28px 24px 48px; max-width: 1080px; margin: 0 auto; font-family: var(--font-ui); }
  h1 { font-family: var(--font-display); color: var(--ink); margin: 6px 0 16px; font-size: clamp(26px,3.4vw,36px); }
  .empty { background: #fff; border: 1px dashed var(--border-strong); border-radius: 16px; padding: 36px; text-align: center; } .empty p { color: var(--muted); }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
  .tx { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 5px; }
  .nm { font-weight: 800; color: var(--ink); text-decoration: none; font-size: 14.5px; }
  .meta { font-size: 12.5px; color: var(--muted); } .row { display: flex; gap: 8px; margin-top: 6px; } .row .btn { flex: 1; justify-content: center; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
</style>
