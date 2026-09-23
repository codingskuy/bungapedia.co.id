<!-- Pembayaran simulasi + tracking timeline + daftar pesanan -->
<script lang="ts">
  import { STATUS_LABEL, rp } from '../market-data';
  import { confirmReceived, fileDispute, orderById, orders, payState, showToast, simulatePayment } from '../market-store';
  import { sessionCustomer } from '../auth';
  import { ensureOrderThread } from '../chat-store';
  import type { Order } from '../market-types';
  export let order: Order | undefined = undefined;
  export let orderId = '';
  export let listMode = false;

  let failNext = false;
  let disputeText = '';
  let disputeOpen = false;
  $: os = [] as Order[];
  $: orders.subscribe((v) => (os = v))();
  $: live = order ?? orderById(orderId);

  async function pay() { if (live) { const ok = await simulatePayment(live.id, failNext); if (ok) location.hash = `#/lacak/${live.id}`; } }
  function confirm() { if (live && confirm('Pesanan sudah diterima dengan baik?')) confirmReceived(live.id); }
  function sendDispute() { if (live && fileDispute(live.id, disputeText)) { disputeOpen = false; disputeText = ''; } }
  function chatWith(target: 'admin') {
    if (!live) return;
    let s: import('../auth').Session | null = null;
    sessionCustomer.subscribe((v) => (s = v))();
    if (!s) {
      showToast('Masuk dulu untuk chat dengan admin.');
      location.hash = '#/masuk';
      return;
    }
    const id = ensureOrderThread(live, target, { role: 'customer', id: s.customerId, name: s.name });
    location.hash = `#/pesan/${id}`;
  }
</script>

{#if listMode}
  <div class="container lst" data-od-id="pesanan-list">
    <p class="eyebrow">{os.length} pesanan (dummy + buatanmu)</p><h1>Pesanan saya</h1>
    {#if os.length === 0}
      <div class="empty"><b>Belum ada pesanan.</b><p>Mulai dari katalog — coba alur “Buket Wisuda → Checkout → Bayar → Lacak”.</p><a class="btn btn-primary" href="#/produk">Cari produk →</a></div>
    {:else}
      <div class="olist">
        {#each os as o}
          <a class="orow" href={o.paymentStatus === 'unpaid' ? `#/bayar/${o.id}` : `#/lacak/${o.id}`} data-od-id="order-{o.id}">
            <img src={o.items[0].img} alt={o.items[0].name} />
            <div><b>{o.id} · {o.items[0].name}{o.items.length > 1 ? ` +${o.items.length - 1}` : ''}</b>
            <small>{STATUS_LABEL[o.status]} · {o.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'} · Settlement {o.settlement.toUpperCase()}</small></div>
            <b>{rp(o.total)}</b><span class="go">→</span>
          </a>
        {/each}
      </div>
    {/if}
  </div>
{:else if !live}
  <div class="container lst" data-od-id="order-missing">
    <p class="eyebrow">Pesanan tidak ditemukan</p><h1>ID “{orderId}” tidak ada</h1>
    <p class="lede">Kemungkinan ID salah ketik atau data localStorage ter-reset. Pilih dari daftar pesanan.</p>
    <p><a class="btn btn-primary" href="#/pesanan">Lihat semua pesanan →</a></p>
  </div>
{:else}
  {#if live.paymentStatus === 'unpaid'}
    <div class="container pay" data-od-id="bayar-{live.id}">
      <p class="eyebrow">Simulasi pembayaran · {live.id}</p><h1>Selesaikan pembayaran</h1>
      <div class="pgrid">
        <div class="card">
          <h3>{live.paymentMethod === 'qris' ? 'QRIS' : live.paymentMethod === 'transfer' ? 'Bank Transfer' : 'E-Wallet'}</h3>
          {#if live.paymentMethod === 'qris'}
            <div class="qr">BUNGAPEDIA · {rp(live.total)}<small>Scan dengan e-wallet / m-banking apa pun (simulasi)</small></div>
          {:else if live.paymentMethod === 'transfer'}
            <div class="qr">VA 8888 0100 {live.id.slice(-4)}<small>Transfer tepat {rp(live.total)} (simulasi)</small></div>
          {:else}
            <div class="qr">Deep-link e-wallet<small>Total {rp(live.total)} (simulasi)</small></div>
          {/if}
          {#if $payState.error}<div class="err" role="alert">{$payState.error}</div>{/if}
          <label class="check"><input type="checkbox" bind:checked={failNext} /> Simulasikan kegagalan (latihan error handling)</label>
          <button class="btn btn-primary big" disabled={$payState.loading} on:click={pay}>{$payState.loading ? 'Memproses…' : `Bayar ${rp(live.total)}`}</button>
          <p class="hint">Setelah bayar: <b>Payment PAID · Order PROCESSING · Settlement PENDING</b></p>
        </div>
        <aside class="card"><h3>Ringkasan</h3>
          {#each live.items as i}<div class="line"><img src={i.img} alt={i.name} /><div><b>{i.name}</b><small>×{i.qty}</small></div><b>{rp(i.price * i.qty)}</b></div>{/each}
          <div class="trow"><span>Total</span><span><b>{rp(live.total)}</b></span></div>
          <p class="hint">Untuk: {live.recipient.name} · {live.delivery.date} {live.delivery.time}</p>
        </aside>
      </div>
    </div>
  {:else}
    <div class="container trk" data-od-id="lacak-{live.id}">
      <p class="eyebrow">{live.id} · Bungapedia</p><h1>{STATUS_LABEL[live.status]}</h1>
      <p class="lede">“Uang saya di tahap mana?” — dana <b>{live.settlement === 'available' ? 'tersedia — pesanan selesai' : 'Pending di Bungapedia'}</b>. Bukan klaim escrow legal.</p>
      <div class="tgrid">
        <div class="card">
          <h3>Timeline pesanan</h3>
          <ol class="tl">
            {#each live.timeline as t}
              <li class:done={t.done} class:now={live.status === t.key}>
                <span class="dot"></span>
                <div><b>{STATUS_LABEL[t.key] ?? t.key}</b><small>{t.at}</small></div>
              </li>
            {/each}
          </ol>
          {#if live.status === 'delivered'}
            <button class="btn btn-primary big" on:click={confirm}>Konfirmasi diterima → settlement tersedia</button>
          {/if}
          {#if live.status !== 'completed' && live.status !== 'disputed'}
            <button class="link-more" on:click={() => (disputeOpen = !disputeOpen)}>Ada masalah? Ajukan komplain</button>
            {#if disputeOpen}
              <textarea rows="3" placeholder="Ceritakan: apa yang dipesan vs diterima… (min 10 karakter)" bind:value={disputeText}></textarea>
              <button class="btn" on:click={sendDispute}>Kirim komplain</button>
            {/if}
          {/if}
          {#if live.status === 'disputed'}
            <div class="err">Komplain: {live.dispute?.reason} · Status: {live.dispute?.status}</div>
          {/if}
        </div>
        <aside class="card">
          <h3>Detail</h3>
          <p><b>{live.items[0].name}</b><br /><small>{live.recipient.name} · {live.recipient.address}<br />{live.delivery.date} {live.delivery.time}<br />“{live.message}”</small></p>
          <div class="trow"><span>Dibayar</span><span>{rp(live.total)} ✓</span></div>
          <div class="trow"><span>Status dana</span><span>{live.settlement === 'pending' ? 'Pending' : live.settlement.toUpperCase()}</span></div>
          <div class="chat-row">
            <button class="btn btn-sm" style="flex:1;justify-content:center" on:click={() => chatWith('admin')}>💬 Chat bantuan</button>
          </div>
          <p><a class="btn" style="width:100%;justify-content:center" href="#/pesan">Butuh bantuan? Hubungi kami →</a></p>
        </aside>
      </div>
    </div>
  {/if}
{/if}

<style>
  .lst, .pay, .trk { padding: 28px 24px 48px; max-width: 1080px; margin: 0 auto; font-family: var(--font-ui); }
  h1 { font-family: var(--font-display); color: var(--ink); margin: 6px 0 10px; font-size: clamp(26px,3.4vw,36px); }
  .lede { color: var(--muted); max-width: 66ch; line-height: 1.65; }
  .olist { display: flex; flex-direction: column; gap: 10px; margin-top: 18px; }
  .orow { display: flex; gap: 12px; align-items: center; background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 10px 14px 10px 10px; text-decoration: none; color: var(--ink); }
  .orow img { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; } .orow small { color: var(--muted); display: block; } .go { margin-left: 8px; }
  .empty { background: #fff; border: 1px dashed var(--border-strong); border-radius: 16px; padding: 36px; text-align: center; margin-top: 18px; } .empty p { color: var(--muted); }
  .pgrid, .tgrid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 18px; margin-top: 18px; align-items: start; }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 22px; } .card h3 { font-family: var(--font-display); color: var(--ink); margin: 0 0 10px; }
  .qr { background: var(--ink); color: #fff; border-radius: 12px; padding: 28px; text-align: center; font-size: 20px; font-weight: 800; } .qr small { display: block; font-size: 12.5px; font-weight: 500; opacity: .75; margin-top: 6px; }
  .err { background: #fdeee9; color: #8f2d17; border-radius: 10px; padding: 12px 14px; font-size: 13.5px; margin: 12px 0; }
  .check { display: flex; gap: 8px; align-items: center; font-size: 13px; color: var(--muted); margin: 12px 0; }
  .big { width: 100%; justify-content: center; padding: 14px; } .hint { font-size: 12.5px; color: var(--muted); }
  .line { display: flex; gap: 10px; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); } .line img { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; } .line small { color: var(--muted); display: block; } .line b:last-child { margin-left: auto; }
  .trow { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
  .chat-row { display: flex; gap: 8px; margin: 10px 0; }
  .tl { list-style: none; margin: 0; padding: 0; } .tl li { display: flex; gap: 12px; padding: 9px 0; color: var(--muted); } .tl .dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--border-strong); margin-top: 3px; flex: none; }
  .tl li.done { color: var(--ink); } .tl li.done .dot { background: var(--accent); border-color: var(--accent); }
  .tl li.now .dot { box-shadow: 0 0 0 4px var(--accent-soft); } .tl small { display: block; font-size: 12px; }
  textarea { width: 100%; border: 1px solid var(--border-strong); border-radius: 10px; padding: 10px 12px; font-family: var(--font-ui); margin: 10px 0; }
  @media (max-width: 900px) { .pgrid, .tgrid { grid-template-columns: 1fr; } }
</style>
