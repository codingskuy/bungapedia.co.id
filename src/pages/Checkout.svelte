<!-- Checkout — ringkasan keranjang + data pengiriman. -->
<script lang="ts">
  import { cart, cartTotal, cartCount, bumpQty, clearCart } from '../store';
  import { rp, SHIP_METHODS } from '../data';
  let placed = false;
  let method = SHIP_METHODS[1];
  function submit(e: Event) {
    e.preventDefault();
    placed = true;
    clearCart();
  }
</script>

<div class="container narrow page" data-od-id="checkout-page">
  {#if placed}
    <div class="done">
      <div class="check">✓</div>
      <h1>Pesanan diterima!</h1>
      <p class="lede">Invoice & jadwal kirim dikirim via WhatsApp. Cut-off 13:00 WIB — pesan sebelum itu untuk kirim besok. Terima kasih! ✿</p>
      <p><a class="btn btn-primary" href="#/stok">Kembali ke Stok Live →</a></p>
    </div>
  {:else if $cart.length === 0}
    <h1>Keranjang kosong</h1>
    <p class="lede">Yuk isi dulu dari Stok Live — promo hari ini menunggumu.</p>
    <p><a class="btn btn-primary" href="#/stok">Belanja Stok Live →</a></p>
  {:else}
    <p class="eyebrow">Checkout · {$cartCount} item</p>
    <h1>Selesaikan pesanan</h1>
    <div class="lines">
      {#each $cart as l}
        <div class="cart-line">
          <img src={l.img} alt={l.name} />
          <div><div class="nm">{l.name}</div><div class="pr">{rp(l.price)}{l.unit}</div></div>
          <div class="qty">
            <button on:click={() => bumpQty(l.id, -1)} aria-label="Kurangi">−</button>
            <b>{l.qty}</b>
            <button on:click={() => bumpQty(l.id, 1)} aria-label="Tambah">+</button>
          </div>
        </div>
      {/each}
    </div>
    <form class="qform" on:submit={submit}>
      <div class="row">
        <div><label for="c-name">Nama penerima</label><input id="c-name" required placeholder="Nama & toko" /></div>
        <div><label for="c-wa">WhatsApp</label><input id="c-wa" required inputmode="tel" placeholder="08…" /></div>
      </div>
      <label for="c-addr">Alamat kirim</label><input id="c-addr" required placeholder="Jalan, kota, patokan" />
      <label for="c-method">Metode kirim</label>
      <select id="c-method" bind:value={method}>{#each SHIP_METHODS as m}<option>{m}</option>{/each}</select>
      <div class="total-row"><span>Total ({method})</span><span>{rp($cartTotal)}</span></div>
      <button type="submit" class="btn btn-primary big">Buat pesanan →</button>
    </form>
  {/if}
</div>

<style>
  .page { padding-top: 32px; padding-bottom: 48px; font-family: var(--font-ui); }
  .narrow { max-width: 720px; }
  .page h1 { font-family: var(--font-display); color: var(--ink); font-size: clamp(28px, 3.6vw, 38px); margin: 6px 0 14px; }
  .lede { color: var(--muted); line-height: 1.65; }
  .lines { display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .qform label { display: block; font-size: 13px; font-weight: 700; color: var(--ink); margin: 14px 0 6px; }
  .qform input, .qform select { width: 100%; border: 1px solid var(--border-strong); border-radius: 10px; padding: 12px 14px; font-size: 14px; font-family: var(--font-ui); color: var(--ink); background: #fff; }
  .big { width: 100%; justify-content: center; margin-top: 18px; padding: 14px; font-size: 15px; }
  .done { text-align: center; padding: 24px 0; }
  .check { width: 64px; height: 64px; border-radius: 50%; background: var(--accent-soft); color: var(--accent-dark); font-size: 30px; font-weight: 800; display: grid; place-items: center; margin: 0 auto 16px; }
  @media (max-width: 640px) { .row { grid-template-columns: 1fr; } }
</style>
