<!-- Checkout marketplace — recipient + delivery + message + payment summary + validasi eksplisit -->
<script lang="ts">
  import { DELIVERY_FEE, PLATFORM_FEE, rp } from '../market-data';
  import { cart, cartTotal, draft, placeOrder, validateDraft, type CartLine } from '../market-store';
  import type { FieldErrors } from '../market-store';

  let lines: CartLine[] = [];
  let total = 0;
  $: cart.subscribe((c) => (lines = c))();
  $: cartTotal.subscribe((t) => (total = t))();

  let d = $draft;
  $: draft.subscribe((v) => (d = v))();
  function sync() { draft.set(d); }
  let errors: FieldErrors = {};
  let attempted = false;

  function submit(e: Event) {
    e.preventDefault();
    attempted = true;
    errors = validateDraft(d, lines.length === 0);
    if (Object.keys(errors).length > 0) return;
    const order = placeOrder(d);
    if (order) location.hash = `#/bayar/${order.id}`;
  }
  function set<K extends keyof typeof d>(k: K, v: (typeof d)[K]) { d = { ...d, [k]: v }; sync(); }
</script>

<div class="container co" data-od-id="checkout-mkt">
  {#if lines.length === 0 && !attempted}
    <p class="eyebrow">Checkout</p><h1>Keranjang masih kosong</h1>
    <p class="lede">Pilih dulu rangkaian favoritmu dari katalog.</p>
    <p><a class="btn btn-primary" href="#/produk">Cari karangan bunga →</a></p>
  {:else}
    <p class="eyebrow">Checkout · {lines.length} item</p>
    <h1>Selesaikan pemesanan</h1>
    {#if errors.cart}<div class="err" role="alert">{errors.cart}</div>{/if}
    <div class="co-grid">
      <form class="card" on:submit={submit} novalidate>
        <h3>1 · Penerima</h3>
        <label for="r-name">Nama penerima</label>
        <input id="r-name" placeholder="cth. Ibu Ratna" value={d.recipientName} on:input={(e) => set('recipientName', e.currentTarget.value)} aria-invalid={!!errors.recipientName} />
        {#if errors.recipientName}<small class="ferr">{errors.recipientName}</small>{/if}
        <div class="row">
          <div><label for="r-phone">No. HP penerima</label>
          <input id="r-phone" inputmode="tel" placeholder="0812xxxxxxx" value={d.recipientPhone} on:input={(e) => set('recipientPhone', e.currentTarget.value)} />
          {#if errors.recipientPhone}<small class="ferr">{errors.recipientPhone}</small>{/if}</div>
          <div><label for="r-date">Tanggal kirim</label>
          <input id="r-date" type="date" min="2026-09-16" value={d.deliveryDate} on:change={(e) => set('deliveryDate', e.currentTarget.value)} />
          {#if errors.deliveryDate}<small class="ferr">{errors.deliveryDate}</small>{/if}</div>
        </div>
        <label for="r-addr">Alamat lengkap</label>
        <input id="r-addr" placeholder="Jalan, nomor, patokan, kota" value={d.recipientAddress} on:input={(e) => set('recipientAddress', e.currentTarget.value)} />
        {#if errors.recipientAddress}<small class="ferr">{errors.recipientAddress}</small>{/if}
        <h3>2 · Momen & pengiriman</h3>
        <div class="row">
          <div><label for="r-time">Jam kirim</label>
          <select id="r-time" value={d.deliveryTime} on:change={(e) => set('deliveryTime', e.currentTarget.value)}>
            <option>08:00–10:00</option><option>10:00–13:00</option><option>13:00–16:00</option><option>16:00–19:00</option>
          </select></div>
          <div><label for="r-pay">Metode bayar (simulasi)</label>
          <select id="r-pay" value={d.paymentMethod} on:change={(e) => set('paymentMethod', e.currentTarget.value)}>
            <option value="qris">QRIS</option><option value="transfer">Bank Transfer</option><option value="ewallet">E-Wallet</option>
          </select></div>
        </div>
        <label for="r-note">Catatan kurir (opsional)</label>
        <input id="r-note" placeholder="Titip satpam / hubungi dulu…" value={d.deliveryNote} on:input={(e) => set('deliveryNote', e.currentTarget.value)} />
        <label for="r-msg">Kartu ucapan</label>
        <textarea id="r-msg" rows="3" placeholder="Selamat ulang tahun, Ibu! — Rina" value={d.message} on:input={(e) => set('message', e.currentTarget.value)}></textarea>
        {#if errors.message}<small class="ferr">{errors.message}</small>{/if}
        <button class="btn btn-primary big" type="submit">Buat pesanan →</button>
      </form>
      <aside class="card sum">
        <h3>Ringkasan</h3>
        {#each lines as l}<div class="line"><img src={l.img} alt={l.name} /><div><b>{l.name}</b><small>×{l.qty}</small></div><b>{rp(l.price * l.qty)}</b></div>{/each}
        <div class="trow"><span>Produk</span><span>{rp(total)}</span></div>
        <div class="trow"><span>Ongkir</span><span>{rp(DELIVERY_FEE)}</span></div>
        <div class="trow"><span>Platform fee</span><span>{rp(PLATFORM_FEE)}</span></div>
        <div class="trow grand"><span>Total</span><span>{rp(total + DELIVERY_FEE + PLATFORM_FEE)}</span></div>
        <p class="prot">🛡 Pembayaran aman via Bungapedia. Status dana <b>Pending</b> sampai kamu konfirmasi pesanan selesai.</p>
        <p class="by">Dikirim oleh <b>Bungapedia</b> · estimasi same-day sebelum 15:00</p>
      </aside>
    </div>
  {/if}
</div>

<style>
  .co { padding: 28px 24px 48px; max-width: 1080px; margin: 0 auto; font-family: var(--font-ui); }
  .co h1 { font-family: var(--font-display); color: var(--ink); margin: 6px 0 14px; font-size: clamp(28px,3.6vw,38px); }
  .lede { color: var(--muted); } .co-grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 18px; align-items: start; }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 22px; }
  .card h3 { font-family: var(--font-display); color: var(--ink); margin: 18px 0 6px; } .card h3:first-child { margin-top: 0; }
  label { display: block; font-size: 13px; font-weight: 700; color: var(--ink); margin: 12px 0 6px; }
  input, select, textarea { width: 100%; border: 1px solid var(--border-strong); border-radius: 10px; padding: 11px 13px; font-size: 14px; font-family: var(--font-ui); color: var(--ink); background: #fff; }
  input[aria-invalid="true"] { border-color: var(--danger); } .ferr { color: var(--danger); font-size: 12.5px; font-weight: 600; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; } .err { background: #fdeee9; color: #8f2d17; border-radius: 10px; padding: 12px 16px; font-size: 14px; margin-bottom: 12px; }
  .big { width: 100%; justify-content: center; margin-top: 18px; padding: 14px; }
  .line { display: flex; gap: 10px; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); } .line img { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; } .line small { color: var(--muted); display: block; } .line b:last-child { margin-left: auto; }
  .trow { display: flex; justify-content: space-between; padding: 7px 0; font-size: 14px; color: #4b5563; } .grand { font-weight: 800; color: var(--ink); font-size: 16px; border-top: 1px solid var(--border); margin-top: 6px; padding-top: 12px; }
  .prot { font-size: 12.5px; color: var(--muted); line-height: 1.6; background: var(--accent-soft); border-radius: 10px; padding: 10px 12px; } .by { font-size: 13px; color: var(--ink); }
  @media (max-width: 900px) { .co-grid { grid-template-columns: 1fr; } .row { grid-template-columns: 1fr; } }
</style>
