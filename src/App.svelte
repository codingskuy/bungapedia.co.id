<script lang="ts">
  import { onMount } from 'svelte';
  import './app.css';
  import { CATEGORIES, DEALS, PREBOOK, PRESS, NAV_LINKS, SUBNAV, HERO_IMG, rp } from './data';
  import { cart, cartCount, cartTotal, addToCart, bumpQty, toast, showToast, ensureCartTimer } from './store';
  import Shop from './pages/Shop.svelte';
  import About from './pages/About.svelte';
  import Journal from './pages/Journal.svelte';
  import Prebook from './pages/Prebook.svelte';
  import Quote from './pages/Quote.svelte';
  import Checkout from './pages/Checkout.svelte';

  let cartOpen = false;
  let quoteOpen = false;
  let mobileNav = false;
  let scrolled = false;
  let query = '';
  let quoteSent = false;
  let rawHash = typeof location !== 'undefined' ? location.hash : '';

  $: isPage = rawHash.startsWith('#/');
  $: route = isPage ? rawHash.slice(1) : '/';

  function syncHash() {
    rawHash = location.hash;
    mobileNav = false;
    if (rawHash.startsWith('#/')) window.scrollTo(0, 0);
  }
  onMount(() => {
    window.addEventListener('hashchange', syncHash);
    syncHash();
  });

  // countdown to 13:00 WIB today (order cutoff, mirrors original "Order by 1pm")
  let remain = '';
  function tick() {
    const now = new Date();
    const cut = new Date(now);
    cut.setHours(13, 0, 0, 0);
    if (cut.getTime() < now.getTime()) cut.setDate(cut.getDate() + 1);
    const s = Math.max(0, Math.floor((cut.getTime() - now.getTime()) / 1000));
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    remain = `${h}:${m}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);

  $: filteredCats = CATEGORIES.filter((c) =>
    (c.name + ' ' + c.detail).toLowerCase().includes(query.trim().toLowerCase())
  );

  function addDeal(id: string) {
    const d = DEALS.find((x) => x.id === id)!;
    addToCart({ id, name: d.name, img: d.img, price: d.now * 16000, unit: d.unit });
    ensureCartTimer();
    showToast(`${d.name} masuk keranjang`);
  }
  function onScroll() {
    scrolled = window.scrollY > 8;
  }
  function submitQuote(e: Event) {
    e.preventDefault();
    quoteSent = true;
  }
  function goShop() {
    if (query.trim()) location.hash = '#/stok';
  }
</script>

<svelte:window on:scroll={onScroll} />

<div class="topbar" data-od-id="topbar">
  Grosir saja · Untuk florist, perangkai & event organizer · <b>1.307 toko</b> pesan hari ini · Stok live
</div>

<header class="site-header" class:scrolled data-od-id="site-header">
  <div class="header-inner">
    <a class="logo" href="#/" aria-label="Bungapedia beranda" data-od-id="logo">
      <span class="logo-mark">✿</span>
      <span class="logo-word">Bungapedia<small>bunga grosir · bungapedia.co.id</small></span>
    </a>
    <nav class="main-nav" aria-label="Navigasi utama" data-od-id="main-nav">
      {#each NAV_LINKS as l}
        <a href={l.href}>{l.label}</a>
      {/each}
    </nav>
    <div class="header-actions">
      <label class="search-pill" data-od-id="search">
        <span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Cari mawar, tulip…" bind:value={query} on:keydown={(e) => { if (e.key === 'Enter') goShop(); }} aria-label="Cari bunga" />
      </label>
      <button class="btn btn-quote" on:click={() => (quoteOpen = true)} data-od-id="cta-quote">Minta Penawaran</button>
      <button class="btn" on:click={() => showToast('Masuk / daftar akun grosir — modul akun segera hadir')} data-od-id="cta-signin">Masuk</button>
      <button
        class="btn cart-btn"
        on:click={() => (cartOpen = true)}
        aria-label="Buka keranjang, {$cartCount} item"
        data-od-id="cta-cart"
      >
        🛒 {$cartCount > 0 ? rp($cartTotal) : 'Keranjang'}
        {#if $cartCount > 0}<span class="cart-count">{$cartCount}</span>{/if}
      </button>
      <button class="btn hamburger" on:click={() => (mobileNav = !mobileNav)} aria-label="Menu" data-od-id="menu-toggle">☰</button>
    </div>
  </div>
  {#if mobileNav}
    <nav class="mobile-nav" aria-label="Navigasi seluler" data-od-id="mobile-nav">
      {#each NAV_LINKS as l}
        <a href={l.href} on:click={() => (mobileNav = false)}>{l.label}</a>
      {/each}
      <a href="#/" on:click={() => { mobileNav = false; quoteOpen = true; }}>Minta Penawaran</a>
    </nav>
  {/if}
  <nav class="subnav" aria-label="Navigasi halaman" data-od-id="subnav">
    <div class="subnav-inner">
      {#each SUBNAV as l}
        <a href={l.href} class:on={route === l.href.slice(1)}>{l.label}</a>
      {/each}
      <span class="cutoff">◷ Cut-off <b>{remain}</b> · kirim dari Jakarta</span>
    </div>
  </nav>
</header>

<main id="top">
  {#if route === '/stok'}
    <Shop />
  {:else if route === '/prebook'}
    <Prebook />
  {:else if route === '/library'}
    <Journal />
  {:else if route === '/blog'}
    <Journal />
  {:else if route === '/about'}
    <About />
  {:else if route === '/quote'}
    <Quote />
  {:else if route === '/checkout'}
    <Checkout />
  {:else}
  <!-- HERO -->
  <section class="hero" data-od-id="hero">
    <div class="hero-grid">
      <div>
        <p class="eyebrow">Grosir saja · Petani → Toko dalam semalam</p>
        <h1>Bunga potong grosir segar, dikirim kilat ke seluruh Indonesia.</h1>
        <p class="hero-sub">
          Langsung dari kebun mitra di Bandung, Batu, Dieng & Bali — petik pagi, terbang malam ini,
          sampai di tokomu besok pagi. Stok live diperbarui harian dari hub distribusi Jakarta.
        </p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#/stok" data-od-id="cta-shop">Belanja Stok Live →</a>
          <button class="btn" on:click={() => (quoteOpen = true)} data-od-id="cta-event">Minta Penawaran Event</button>
        </div>
        <div class="hero-stats">
          <div><b>1.307</b><span>toko pesan minggu ini</span></div>
          <div><b>Jakarta Hub</b><span>hub distribusi</span></div>
          <div class="cd"><b>{remain}</b><span>cut-off kirim besok · 13:00 WIB</span></div>
        </div>
      </div>
      <div class="hero-media">
        <img src={HERO_IMG} alt="Rangkaian bunga segar Bungapedia" width="1600" height="900" />
        <div class="hero-card"><span class="live-dot"></span><span><b>Stok live</b> · 200+ SKU dipetik pagi ini · harga grosir diperbarui 05:00 WIB</span></div>
      </div>
    </div>
  </section>

  <!-- TRUST -->
  <div class="trust-strip" data-od-id="trust-strip">
    <div class="trust-grid">
      <div class="trust-cell"><span class="trust-ic">🌱</span><div><b>20+ tahun di industri</b><span>Importir & distributor bunga grosir</span></div></div>
      <div class="trust-cell"><span class="trust-ic">🌍</span><div><b>Kirim nasional</b><span>Bandung, Batu, Dieng, Bali & impor</span></div></div>
      <div class="trust-cell"><span class="trust-ic">✈</span><div><b>Same-day & overnight</b><span>Cut-off 13:00 WIB setiap hari</span></div></div>
      <div class="trust-cell"><span class="trust-ic">🛡</span><div><b>Garansi kesegaran</b><span>Klaim mudah untuk tiap pesanan</span></div></div>
    </div>
  </div>

  <!-- CATALOG -->
  <section class="section" id="katalog" data-od-id="catalog">
    <div class="container">
      <div class="section-head">
        <div>
          <p class="eyebrow">Jelajahi katalog</p>
          <h2>Cari berdasar varietas</h2>
          <p>Semua kategori terhubung ke stok live hari ini. Harga update 05:00 WIB.</p>
        </div>
        <a class="link-more" href="#/stok">Lihat katalog penuh →</a>
      </div>
      {#if filteredCats.length === 0}
        <p class="empty-note">Tidak ada varietas cocok “{query}”. Coba “mawar” atau “tulip”.</p>
      {:else}
        <div class="cat-grid">
          {#each filteredCats as c}
            <a class="cat-card" href="#/stok" data-od-id="cat-card-{c.id}">
              <div class="ph">
                <img src={c.img} alt={c.name} loading="lazy" />
                {#if c.badge}<span class="cat-badge">{c.badge}</span>{/if}
              </div>
              <div class="tx"><b>{c.name}</b><span>{c.detail}</span></div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <!-- DEALS -->
  <section class="section" id="deals" data-od-id="deals">
    <div class="container">
      <div class="section-head">
        <div>
          <p class="eyebrow">Live · update 05:00 WIB</p>
          <h2>Promo hari ini</h2>
          <p>Diskon harga petani yang dipilih manual. Tambah ke cart sebelum cut-off 13:00 untuk kirim besok.</p>
        </div>
        <a class="link-more" href="#/stok">Lihat semua →</a>
      </div>
      <div class="deal-grid">
        {#each DEALS as d}
          <article class="deal-card" data-od-id="deal-card-{d.id}">
            <div class="ph">
              <img src={d.img} alt={d.name} loading="lazy" />
              <span class="deal-tag">{d.tag}</span>
            </div>
            <div class="tx">
              <span class="deal-farm">{d.farm} · Bandung</span>
              <span class="deal-name">{d.name}</span>
              <div class="deal-price"><span class="was">${d.was.toFixed(2)}</span><span class="now">{rp(d.now * 16000)}{d.unit}</span></div>
              <div class="deal-row">
                <button class="btn btn-primary btn-sm" on:click={() => addDeal(d.id)}>+ Keranjang</button>
                <button class="btn btn-sm" on:click={() => showToast(d.name + ' · ' + d.farm)}>Detail</button>
              </div>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <!-- EVENT BAND -->
  <section class="band-dark" data-od-id="event-band">
    <div class="band-inner">
      <p class="eyebrow" style="color: var(--footer-fg)">Untuk event & wedding planner</p>
      <h2>Rencanakan event dengan percaya diri.</h2>
      <p class="lead">Ceritakan tanggal, venue & jumlah tamu — kami susun daftar belanja lengkap dalam 1×24 jam, lead time terkunci, substitusi pre-approved.</p>
      <div class="pill-row">
        <div class="pill"><b>7–10d</b><span>event standar</span></div>
        <div class="pill"><b>14d</b><span>event besar / dekor penuh</span></div>
        <div class="pill"><b>21d</b><span>premium / impor khusus</span></div>
      </div>
      <button class="btn btn-primary" on:click={() => (quoteOpen = true)} data-od-id="cta-event-quote">Minta Penawaran Event</button>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="section" id="stok" data-od-id="how-it-works">
    <div class="container">
      <p class="eyebrow">Cara kerja</p>
      <div class="section-head"><div><h2>Dari kebun ke tokomu besok pagi.</h2></div></div>
      <div class="steps-grid">
        <div class="step-card"><span class="step-num">1</span><b>🌸 Jelajahi stok live</b><p>200+ SKU harian dengan jumlah batang, grade & panjang tangkai real. Filter berdasar warna, asal & grade.</p></div>
        <div class="step-card"><span class="step-num">2</span><b>⏰ Pesan sebelum 13:00 WIB</b><p>Harga terkunci per box besok. Tim kami cek & tandai substitusi sebelum menagih.</p></div>
        <div class="step-card"><span class="step-num">3</span><b>🚚 Pilih pengirimanmu</b><p>Overnight ke 45 kota, same-day Jabodetabek, atau ambil di hub. Diskon volume untuk akun terverifikasi.</p></div>
      </div>
    </div>
  </section>

  <!-- PREBOOK -->
  <section class="section" id="prebook" data-od-id="prebook">
    <div class="container">
      <div class="section-head">
        <div>
          <p class="eyebrow">Kalender pre-book</p>
          <h2>Pesan jauh hari, hemat lebih banyak.</h2>
          <p>Kunci harga & alokasi untuk puncak musim bunga. Pre-book melindungimu dari lonjakan harga pasar.</p>
        </div>
        <a class="link-more" href="#/prebook">Semua jadwal →</a>
      </div>
      <div class="prebook-grid">
        {#each PREBOOK as p}
          <div class="prebook-card">
            <div><div class="dt">{p.date}</div><b>{p.title} {#if p.hot}<span class="hot-flag">Ramai</span>{/if}</b><small>{p.note}</small></div>
            <button class="btn btn-sm" on:click={() => { quoteOpen = true; }}>Amankan</button>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- GROWERS -->
  <section class="band-dark" id="tentang" data-od-id="growers">
    <div class="band-inner">
      <p class="eyebrow" style="color: var(--footer-fg)">Jejaring petani</p>
      <h2>Dipasok petani di lima pulau & mancanegara.</h2>
      <p class="lead">Tanpa perantara. Rantai dingin dari panen ke hub Jakarta, lalu ke tokomu. Arahkan kursor ke hub untuk melihat asalnya.</p>
      <div class="map-card">
        <div class="hub-row">
          <span class="hub-chip"><b>Jakarta Hub</b> · distribusi nasional</span>
          <span class="hub-chip">Bandung · mawar & hortensia</span>
          <span class="hub-chip">Batu · lily & alstroemeria</span>
          <span class="hub-chip">Dieng · alstroemeria</span>
          <span class="hub-chip">Bali · tropis & anthurium</span>
          <span class="hub-chip">Ekuador · impor premium</span>
        </div>
      </div>
    </div>
  </section>

  <!-- PRESS -->
  <div class="press-band" data-od-id="press">
    <div class="press-inner">
      <p class="eyebrow">Diakui industri</p>
      <div><b style="font-family: var(--font-display); font-size: 22px; color: var(--ink)">Diliput Media</b></div>
      <div class="press-logos">{#each PRESS as p}<span>{p}</span>{/each}</div>
    </div>
  </div>

  <!-- WHOLESALE -->
  <section id="gabung" data-od-id="wholesale">
    <div class="container">
      <div class="wholesale-card">
        <div>
          <p class="eyebrow">Cara bergabung</p>
          <h2>Buka akun grosir dalam tiga langkah.</h2>
          <p style="color: var(--muted); font-size: 15px; line-height: 1.65">Bungapedia khusus grosir — florist, desainer & profesional event. Daftar sekali, buka harga grosir, pre-book & overnight.</p>
          <p><button class="btn btn-primary" on:click={() => (quoteOpen = true)} data-od-id="cta-wholesale">Daftar Akses Grosir</button></p>
        </div>
        <ol>
          <li><span class="step-dot">1</span><span><b style="color: var(--ink)">Daftar</b><br />Ceritakan usahamu, volume bulanan & kotamu. Formulir lima menit.</span></li>
          <li><span class="step-dot">2</span><span><b style="color: var(--ink)">Verifikasi</b><br />Kirim bukti usaha. Disetujui dalam satu hari kerja.</span></li>
          <li><span class="step-dot">3</span><span><b style="color: var(--ink)">Belanja</b><br />Belanja stok live, pre-book, atau minta penawaran event.</span></li>
        </ol>
      </div>
    </div>
  </section>
  {/if}
</main>

<footer class="site-footer" data-od-id="site-footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="logo" href="#/" style="text-decoration: none; color: #fff"><span class="logo-mark">✿</span><span class="logo-word">Bungapedia</span></a>
        <p>Keluarga florist Indonesia. Harga grosir untuk profesional — dengan harga & ketersediaan live, rantai dingin terjaga dari kebun ke tokomu.</p>
        <p><b style="color:#fff">0800-1-BUNGA</b><br />Hub Jakarta · Pasar Bunga Rawa Belong<br />Senin–Sabtu 05:00–17:00 WIB</p>
      </div>
      <div><h4>Belanja</h4><a href="#/stok">Stok Live</a><a href="#/prebook">Prebook</a><a href="#/stok">Box Kombo</a><a href="#/quote">Minta Penawaran</a></div>
      <div><h4>Untuk Pembeli</h4><a href="#/quote">Daftar Grosir</a><a href="#/quote">Masuk</a><a href="#/quote">Minta Penawaran</a><a href="#/stok">Pengiriman</a><a href="#/quote">Ajukan Klaim</a></div>
      <div><h4>Belajar</h4><a href="#/library">Perpustakaan Bunga</a><a href="#/blog">Blog</a><a href="#/about">Tentang</a><a href="#/about">FAQ</a><a href="#/quote">Kontak</a></div>
      <div><h4>Kebijakan</h4><a href="#/about">Kredit & Pembayaran</a><a href="#/about">Syarat Layanan</a><a href="#/about">Kebijakan Privasi</a></div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Bungapedia.co.id · PT Bunga Pedia Nusantara. Hak cipta dilindungi.</span>
      <span>Terinspirasi struktur flowermarketplace.com · konten & merek milik Bungapedia</span>
    </div>
  </div>
</footer>

<!-- CART DRAWER -->
<div class="scrim" class:open={cartOpen || quoteOpen} role="presentation" on:click={() => { cartOpen = false; quoteOpen = false; }} on:keydown={(e) => { if (e.key === 'Escape') { cartOpen = false; quoteOpen = false; } }}></div>
<aside class="drawer" class:open={cartOpen} aria-hidden={!cartOpen} data-od-id="cart-drawer">
  <header><b>Keranjang ({$cartCount})</b><button class="btn btn-sm" on:click={() => (cartOpen = false)}>✕ Tutup</button></header>
  <div class="items">
    {#if $cart.length === 0}
      <p class="empty-note">Keranjang masih kosong.<br />Yuk tambah promo hari ini 🥀</p>
    {:else}
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
    {/if}
  </div>
  <footer>
    <div class="total-row"><span>Total</span><span>{rp($cartTotal)}</span></div>
    {#if $cart.length === 0}
      <button class="btn btn-primary" style="width:100%; justify-content:center" disabled>Checkout →</button>
    {:else}
      <a class="btn btn-primary" style="width:100%; justify-content:center" href="#/checkout" on:click={() => (cartOpen = false)}>Checkout →</a>
    {/if}
  </footer>
</aside>

<!-- QUOTE MODAL -->
<div class="modal" class:open={quoteOpen} role="dialog" aria-modal="true" aria-label="Minta penawaran" data-od-id="quote-modal">
  <div class="modal-card">
    {#if !quoteSent}
      <h3>Minta penawaran</h3>
      <p style="color: var(--muted); font-size: 14px; margin: 0">Event atau kebutuhan rutin? Balasan dalam 1×24 jam.</p>
      <form on:submit={submitQuote}>
        <label for="q-name">Nama & usaha</label>
        <input id="q-name" required placeholder="cth. Rina — Rina Florist, Bandung" />
        <label for="q-date">Tanggal dibutuhkan</label>
        <input id="q-date" type="date" required />
        <label for="q-type">Kebutuhan</label>
        <select id="q-type"><option>Event / wedding</option><option>Stok toko rutin</option><option>Pre-book musim</option><option>Korporat</option></select>
        <label for="q-msg">Detail</label>
        <textarea id="q-msg" rows="3" placeholder="Jenis bunga, jumlah, kota kirim…"></textarea>
        <div class="modal-actions">
          <button type="submit" class="btn btn-primary" style="flex:1; justify-content:center">Kirim →</button>
          <button type="button" class="btn" on:click={() => (quoteOpen = false)}>Batal</button>
        </div>
      </form>
    {:else}
      <h3>✓ Terkirim!</h3>
      <p style="color: var(--muted); font-size: 14.5px; line-height: 1.65">Tim Bungapedia akan menghubungimu dalam 1×24 jam dengan daftar belanja & harga terkunci. Cek email/SMS ya.</p>
      <div class="modal-actions">
        <button class="btn btn-primary" style="flex:1; justify-content:center" on:click={() => { quoteOpen = false; quoteSent = false; }}>Kembali belanja</button>
      </div>
    {/if}
  </div>
</div>

{#if $toast}<div class="toast show" role="status">{$toast}</div>{/if}
