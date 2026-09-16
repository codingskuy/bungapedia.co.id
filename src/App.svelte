<script lang="ts">
  import { onMount } from 'svelte';
  import './app.css';
  import { FAQS, OCCASIONS, PARTNERS, PRODUCTS, REVIEWS, COMPANY_LEGAL, partnerById, rp } from './market-data';
  import { cartCount, cartTotal, appError, catalogQuery, clearError, showToast, toast, wishlist } from './market-store';
  import { logout, sessionCustomer } from './auth';
  import MarketProducts from './pages/MarketProducts.svelte';
  import MarketProductDetail from './pages/MarketProductDetail.svelte';
  import MarketPartners from './pages/MarketPartners.svelte';
  import MarketCheckout from './pages/MarketCheckout.svelte';
  import MarketOrder from './pages/MarketOrder.svelte';
  import Login from './pages/Login.svelte';
  import CustomerRegister from './pages/CustomerRegister.svelte';
  import AccountView from './pages/AccountView.svelte';
  import WishlistView from './pages/WishlistView.svelte';
  import MarketHome from './pages/MarketHome.svelte';
  import AboutPage from './pages/AboutPage.svelte';
  import ChatList from './pages/ChatList.svelte';
  import ChatRoom from './pages/ChatRoom.svelte';
  import { catalog } from './ops-store';
  import { productById } from './market-data';

  const base = import.meta.env.BASE_URL;

  let rawHash = typeof location !== 'undefined' ? location.hash : '';
  let scrolled = false;
  let mobileNav = false;
  let cartOpen = false;
  let homeQuery = '';
  const CITIES = ['Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Pusat', 'Bandung', 'Semarang', 'Surabaya', 'Denpasar'];
  let city = 'Jakarta Selatan';
  let hq = '';
  try {
    city = localStorage.getItem('bp-city') ?? city;
  } catch { /* abaikan */ }
  $: try {
    localStorage.setItem('bp-city', city);
  } catch { /* abaikan */ }
  function goHeaderSearch() {
    catalogQuery.set(hq.trim());
    if (page !== 'produk') location.hash = '#/produk';
  }
  let loginReturn = '#/akun';
  let logged = false;
  sessionCustomer.subscribe((v) => (logged = !!v));
  let lines: import('./market-store').CartLine[] = [];
  import { cart } from './market-store';
  $: cart.subscribe((c) => (lines = c))();

  function syncHash() {
    rawHash = location.hash;
    mobileNav = false;
    clearError();
    if ((rawHash === '#/checkout' || rawHash === '#/akun' || rawHash.startsWith('#/pesan')) && !logged) loginReturn = rawHash;
    if (rawHash.startsWith('#/')) window.scrollTo(0, 0);
  }
  onMount(() => {
    window.addEventListener('hashchange', syncHash);
    syncHash();
  });

  // hash router: #/produk/ID, #/partner/ID, #/bayar/ID, #/lacak/ID
  $: path = rawHash.startsWith('#/') ? rawHash.slice(1) : '/';
  $: seg = path.split('/').filter(Boolean);
  $: page = seg.length === 0 ? 'home' : seg[0];
  $: param = decodeURIComponent(seg[1] ?? '');

  $: pdp = page === 'produk' && param ? ($catalog.find((p) => p.id === param) ?? productById(param)) : undefined;
  $: partnerObj = page === 'partner' && param ? PARTNERS.find((p) => p.id === param) : undefined;

  function onScroll() { scrolled = window.scrollY > 8; }
  function onLoginSuccess() {
    const t = loginReturn;
    loginReturn = '#/akun';
    location.hash = t;
  }
  function searchOccasion(o: string) { location.hash = '#/produk'; showToast(`Filter momen: ${o} — pilih di katalog`); }
  function goSearch() {
    if (!homeQuery.trim()) { location.hash = '#/produk'; return; }
    location.hash = '#/produk';
    showToast(`Mencari “${homeQuery.trim()}” di katalog`);
  }
  $: popular = $catalog.filter((p) => p.popular).concat($catalog.slice(0, 4)).slice(0, 4);
  $: heroImg = `${import.meta.env.BASE_URL}assets/images/flowermarketplace.com/0b5c95843a684c817befc78c95993fc3-1600-93dc4b0060.webp`;
</script>

<svelte:window on:scroll={onScroll} />

<div class="topbar" data-od-id="topbar">
  Marketplace karangan bunga · <b>{PARTNERS.length} partner</b> · Transaksi via platform · Settlement transparan
</div>

<header class="site-header" class:scrolled data-od-id="site-header">
  <div class="header-inner">
    <a class="logo" href="#/" aria-label="Bungapedia beranda" data-od-id="logo">
      <img class="logo-lockup" src={base + 'assets/brand/bungapedia-lockup.png'} alt="Bungapedia — Small Gifts, Meaningful Bonds" />
    </a>
    <div class="header-mid" data-od-id="header-search">
      <p class="hi">{#if $sessionCustomer}Halo, {$sessionCustomer.name} — {/if}mau kirim apresiasi untuk momen apa?</p>
      <div class="hsearch-row">
        <label class="loc-row">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          <select bind:value={city} aria-label="Kota kirim">
            {#each CITIES as c}<option>{c}</option>{/each}
          </select>
        </label>
        <input type="search" placeholder="Cari buket wisuda, papan opening…" bind:value={hq} on:keydown={(e) => { if (e.key === 'Enter') goHeaderSearch(); }} aria-label="Cari produk" />
        <button class="btn btn-primary" on:click={goHeaderSearch}>Cari</button>
      </div>
    </div>
    <div class="header-actions">
      {#if $sessionCustomer}
        <a class="hmenu" href="#/akun" data-od-id="cta-account" aria-label="Akun {$sessionCustomer.name}">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          <span>{$sessionCustomer.name.split(' ')[0]}</span>
        </a>
      {:else}
        <a class="hmenu" href="#/masuk" data-od-id="cta-signin" aria-label="Masuk atau daftar">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          <span>Masuk</span>
        </a>
      {/if}
      <a class="hmenu" href="#/checkout" aria-label="Keranjang, {$cartCount} item" data-od-id="cta-cart">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
        <span>Keranjang</span>
        {#if $cartCount > 0}<span class="cart-count">{$cartCount}</span>{/if}
      </a>
      <button class="btn hamburger" on:click={() => (mobileNav = !mobileNav)} aria-label="Menu">☰</button>
    </div>
  </div>
  {#if mobileNav}
    <nav class="mobile-nav" data-od-id="mobile-nav">
      <a href="#/produk" on:click={() => (mobileNav = false)}>Produk</a>
      <a href="#/partner" on:click={() => (mobileNav = false)}>Partner</a>
      <a href="#/pesanan" on:click={() => (mobileNav = false)}>Pesanan</a>
      <a href="#/tentang" on:click={() => (mobileNav = false)}>Tentang</a>
      <a href="#/checkout" on:click={() => (mobileNav = false)}>Checkout</a>
      {#if $sessionCustomer}
        <a href="#/akun" on:click={() => (mobileNav = false)}>Akun saya</a>
        <a href="#/pesan" on:click={() => (mobileNav = false)}>Pesan</a>
        <a href="#/wishlist" on:click={() => (mobileNav = false)}>Wishlist</a>
      {:else}
        <a href="#/masuk" on:click={() => (mobileNav = false)}>Masuk / Daftar</a>
      {/if}
    </nav>
  {/if}
</header>

{#if $appError}
  <div class="errbar" role="alert" data-od-id="app-error">
    <div><b>⚠ {$appError.code}</b> — {$appError.message}<br /><small>{$appError.recover}</small></div>
    <div style="display:flex;gap:8px">
      <a class="btn btn-sm" href="#/produk">Ke katalog</a>
      <button class="btn btn-sm" on:click={clearError}>Tutup</button>
    </div>
  </div>
{/if}

<main id="top">
  {#if page === 'produk' && param}
    <MarketProductDetail product={pdp} notFoundId={param} />
  {:else if page === 'produk'}
    <MarketProducts />
  {:else if page === 'partner' && param}
    <MarketPartners partner={partnerObj} />
  {:else if page === 'partner'}
    <MarketPartners listMode />
  {:else if page === 'checkout'}
    {#if $sessionCustomer}
      <MarketCheckout />
    {:else}
      <Login role="customer" title="Masuk dulu" subtitle="Checkout butuh akun" on:success={onLoginSuccess} />
    {/if}
  {:else if page === 'masuk'}
    {#if $sessionCustomer}
      <AccountView />
    {:else}
      <Login role="customer" title="Masuk" accentWord="Bungapedia" subtitle="Satu akun untuk belanja & pantau pesanan" on:success={onLoginSuccess} />
    {/if}
  {:else if page === 'daftar'}
    {#if $sessionCustomer}
      <AccountView />
    {:else}
      <CustomerRegister />
    {/if}
  {:else if page === 'akun'}
    {#if $sessionCustomer}
      <AccountView />
    {:else}
      <Login role="customer" title="Masuk dulu" subtitle="Halaman akun butuh login" on:success={onLoginSuccess} />
    {/if}
  {:else if page === 'wishlist'}
    <WishlistView />
  {:else if page === 'tentang'}
    <AboutPage />
  {:else if page === 'pesan' && param}
    {#if $sessionCustomer}
      <ChatRoom threadId={param} me={{ role: 'customer', id: $sessionCustomer.customerId, name: $sessionCustomer.name }} />
    {:else}
      <Login role="customer" title="Masuk dulu" subtitle="Pesan butuh login" on:success={onLoginSuccess} />
    {/if}
  {:else if page === 'pesan'}
    {#if $sessionCustomer}
      <div class="container wrap">
        <p class="eyebrow">Pesan · admin & partner</p>
        <h1 class="ptitle">Kotak masuk</h1>
        <ChatList me={{ role: 'customer', id: $sessionCustomer.customerId, name: $sessionCustomer.name }} emptyHint="Belum ada percakapan. Buka dari halaman tracking via tombol Chat." />
      </div>
    {:else}
      <Login role="customer" title="Masuk dulu" subtitle="Pesan butuh login" on:success={onLoginSuccess} />
    {/if}
  {:else if page === 'bayar'}
    <MarketOrder orderId={param} />
  {:else if page === 'lacak'}
    <MarketOrder orderId={param} />
  {:else if page === 'pesanan'}
    <MarketOrder listMode />
  {:else if page !== 'home' && !['produk','partner','checkout','masuk','daftar','akun','wishlist','pesan','tentang','bayar','lacak','pesanan'].includes(page)}
    <div class="container soon" data-od-id="404">
      <p class="eyebrow">404 · rute tidak dikenal</p>
      <h1>Halaman “/{page}” tidak ada</h1>
      <p class="lede">Jangan khawatir — semua navigasi P0 customer sudah terdaftar. Kembali ke jalur demo.</p>
      <p><a class="btn btn-primary" href="#/">Ke beranda →</a> <a class="btn" href="#/produk">Katalog</a></p>
    </div>
  {:else if $sessionCustomer}
    <MarketHome />
  {:else}
    <!-- HOMEPAGE marketplace — IA prompt §24 -->
    <section class="hero" data-od-id="hero">
      <div class="hero-grid">
        <div>
          <p class="eyebrow">Marketplace · {PARTNERS.length} partner terkurasi</p>
          <h1>Temukan Karangan Bunga dari Partner Terpercaya</h1>
          <p class="hero-sub">Pilih, pesan, dan pantau karangan bunga dari berbagai penyedia jasa dalam satu platform. Kamu tahu siapa yang merangkai — dan tahu uangmu di tahap mana.</p>
          <div class="hero-search" data-od-id="hero-search">
            <input type="search" placeholder="Cari “Bunga Ulang Tahun”…" bind:value={homeQuery} on:keydown={(e) => { if (e.key === 'Enter') goSearch(); }} aria-label="Cari karangan bunga" />
            <button class="btn btn-primary" on:click={goSearch}>Cari Karangan Bunga</button>
          </div>
          <div class="hero-cta">
            <a class="link-more" href="#/produk">Lihat Semua Produk →</a>
            <a class="wishlist-link" href="#/wishlist">♥ {$wishlist.length} wishlist</a>
          </div>
          <div class="hero-stats">
            <div><b>{PRODUCTS.length * 100}+</b><span>produk kurasi</span></div>
            <div><b>★ 4.8</b><span>rata-rata rating</span></div>
            <div><b>Same-day</b><span>Jabodetabek & Bandung</span></div>
          </div>
        </div>
        <div class="hero-media">
          <img src={heroImg} alt="Rangkaian bunga Bungapedia dari partner terverifikasi" width="1600" height="900" />
          <div class="hero-card"><span class="live-dot"></span><span><b>Dibuat oleh Bunga Sejahtera</b> ✓ Verified · ★ 4.9 · foto QC sebelum kirim</span></div>
        </div>
      </div>
    </section>

    <section class="section" data-od-id="shop-by-occasion">
      <div class="container">
        <p class="eyebrow">Shop by occasion</p>
        <h2>Untuk momen apa?</h2>
        <div class="occ-grid">
          {#each OCCASIONS as o}
            <button class="occ-card" on:click={() => searchOccasion(o)} data-od-id="occ-{o}"><b>{o}</b><span>Cari →</span></button>
          {/each}
        </div>
      </div>
    </section>

    <section class="section" data-od-id="popular">
      <div class="container">
        <div class="section-head"><div><p class="eyebrow">Populer minggu ini</p><h2>Produk favorit customer</h2></div><a class="link-more" href="#/produk">Semua produk →</a></div>
        <div class="deal-grid">
          {#each popular as p}
            {@const pt = partnerById(p.partnerId)}
            <article class="deal-card" data-od-id="pop-{p.id}">
              <a class="ph" href="#/produk/{p.id}"><img src={p.img} alt={p.name} loading="lazy" /></a>
              <div class="tx"><span class="deal-farm">{pt.name} {#if pt.verified}✓{/if}</span>
                <a class="deal-name" href="#/produk/{p.id}">{p.name}</a>
                <div class="deal-price"><b class="now">{rp(p.price)}</b><span>★ {p.rating} ({p.reviews})</span></div>
              </div>
            </article>
          {/each}
        </div>
      </div>
    </section>

    <section class="section" data-od-id="trusted-partners">
      <div class="container">
        <div class="section-head"><div><p class="eyebrow">Trusted partners</p><h2>Dikerjakan siapa? Jelas.</h2></div><a class="link-more" href="#/partner">Semua partner →</a></div>
        <div class="steps-grid">
          {#each PARTNERS.slice(0, 3) as pt}
            <a class="step-card" href="#/partner/{pt.id}" data-od-id="home-{pt.id}">
              <span class="step-num">✓</span><b>{pt.name} {#if pt.verified}<span class="vbadge">Verified</span>{/if}</b>
              <p>★ {pt.rating} · {(pt.orders / 1000).toFixed(1)}K order · {pt.city}. {pt.productionTime} produksi.</p>
            </a>
          {/each}
        </div>
      </div>
    </section>

    <section class="section" data-od-id="how-it-works">
      <div class="container">
        <p class="eyebrow">Cara kerja</p><h2>Discover → Compare → Protected → Track → Settlement</h2>
        <div class="steps-grid">
          <div class="step-card"><span class="step-num">1</span><b>🔍 Discover by momen</b><p>Cari berdasar momen & penerima — bukan sekadar kategori bunga mentah.</p></div>
          <div class="step-card"><span class="step-num">2</span><b>⚖ Compare partner</b><p>Bandingkan harga, rating, estimasi, dan area sebelum memilih.</p></div>
          <div class="step-card"><span class="step-num">3</span><b>🛡 Protected transaction</b><p>Bayar via platform. Dana Pending sampai kamu konfirmasi selesai.</p></div>
        </div>
      </div>
    </section>

    <section class="band-dark" data-od-id="protection">
      <div class="band-inner">
        <p class="eyebrow" style="color: var(--footer-fg)">Transaction protection</p>
        <h2>Uangmu di tahap mana? Selalu terlihat.</h2>
        <p class="lead">✓ Payment received → ✓ Partner confirmed → ✓ Being prepared → ● Waiting delivery → ○ Settlement after completion. Bukan klaim escrow legal — visualisasi proteksi untuk demo bisnis.</p>
        <p><a class="btn btn-primary" href="#/pesanan">Coba lacak pesanan dummy →</a></p>
      </div>
    </section>

    <section class="section" data-od-id="reviews">
      <div class="container">
        <p class="eyebrow">Customer reviews</p><h2>Kenapa mereka berani pesan?</h2>
        <div class="steps-grid">
          {#each REVIEWS as r}
            <div class="step-card"><span class="step-num">★</span><b>{r.name}</b><p>“{r.text}”</p><small style="color:var(--muted)">{r.product}</small></div>
          {/each}
        </div>
      </div>
    </section>

    <section class="section" data-od-id="faq">
      <div class="container">
        <div class="wholesale-card">
          <div><p class="eyebrow">FAQ</p><h2>Punya toko bunga? Gabung sebagai partner.</h2>
          <p style="color:var(--muted);font-size:15px;line-height:1.65">Dapatkan order konsisten, kelola katalog & settlement dalam satu dashboard. Verifikasi dikontrol admin.</p>
          <p><a class="btn btn-primary" href={base + 'partner/'} data-od-id="cta-join">Gabung sebagai Partner →</a></p></div>
          <div>
            {#each FAQS as f}<details><summary>{f.q}</summary><p>{f.a}</p></details>{/each}
          </div>
        </div>
      </div>
    </section>
  {/if}
</main>

<footer class="site-footer" data-od-id="site-footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-brand">
        <img class="logo-lockup foot" src={base + 'assets/brand/bungapedia-lockup.png'} alt="Bungapedia — Small Gifts, Meaningful Bonds" />
        <p>Hantarkan Apresiasi, Satukan Kebersamaan. Marketplace yang mempertemukan customer dengan partner terpercaya — dari pencarian hingga settlement.</p>
      </div>
      <div><h4>Customer</h4><a href="#/produk">Katalog</a><a href="#/partner">Partner</a><a href="#/pesanan">Lacak pesanan</a><a href="#/akun">Akun saya</a><a href="#/wishlist">Wishlist</a></div>
      <div><h4>Partner</h4><a href={base + 'partner/'}>Gabung sebagai partner</a><a href="#/partner">Direktori partner</a></div>
      <div><h4>Bantuan</h4><a href="#/tentang">Tentang kami</a><a href="#/pesan">Pesan & bantuan</a><a href="#/pesanan">Lacak pesanan</a><a href="#/masuk">Masuk / Daftar</a><a href="#/">Beranda</a></div>
    </div>
    <div class="footer-bottom"><span>© 2026 Bungapedia · {COMPANY_LEGAL} · Prototype validasi — mock data, pembayaran & settlement disimulasikan.</span></div>
  </div>
</footer>

{#if $toast}<div class="toast show" role="status">{$toast}</div>{/if}

<style>
  .main-nav a.on { border-bottom-color: var(--accent); color: var(--accent-dark); }
  /* Header ringkas: ikon di atas, label di bawah, tanpa border */
  .hmenu {
    position: relative; display: inline-flex; flex-direction: column;
    align-items: center; gap: 3px; min-width: 56px; padding: 6px 8px;
    color: var(--ink); text-decoration: none;
    font-size: 11.5px; font-weight: 600; line-height: 1.2;
  }
  .hmenu:hover { color: var(--accent-dark); }
  .hmenu:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; border-radius: 8px; }
  .hmenu .cart-count { top: 0; right: 8px; }
  /* Search + lokasi di tengah header: lokasi kiri, kolom ketik dominan */
  .header-mid { flex: 1; min-width: 0; max-width: 640px; margin: 0 auto; }
  .hi { margin: 0 0 7px; font-size: 13px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hsearch-row { display: flex; gap: 8px; align-items: center; }
  .loc-row { flex: none; display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); border-right: 1px solid var(--border-strong); padding-right: 8px; }
  .loc-row select { border: 0; background: transparent; font-size: 12.5px; font-weight: 800; color: var(--ink); font-family: var(--font-ui); padding: 2px 0; max-width: 130px; }
  .hsearch-row input { flex: 1 1 auto; min-width: 0; border: 1px solid var(--border-strong); border-radius: 999px; padding: 10px 16px; font-size: 13.5px; font-family: var(--font-ui); color: var(--ink); }
  .hsearch-row .btn { flex: none; padding: 10px 20px; font-size: 13.5px; }
  @media (max-width: 960px) {
    .header-inner { flex-wrap: wrap; }
    .header-mid { order: 3; flex-basis: 100%; max-width: none; }
    .hi { display: none; }
  }
  .foot-brand { display: flex; align-items: center; gap: 8px; }
  .errbar { max-width: 1180px; margin: 14px auto 0; background: #fdeee9; border: 1px solid #f3c4b5; color: #7c2d12; border-radius: 12px; padding: 14px 18px; display: flex; gap: 14px; align-items: center; justify-content: space-between; font-family: var(--font-ui); font-size: 14px; }
  .soon { padding: 48px 24px 64px; max-width: 820px; margin: 0 auto; font-family: var(--font-ui); }
  .wrap { max-width: 900px; margin: 0 auto; padding: 28px 24px 48px; }
  .ptitle { font-family: var(--font-display); color: var(--ink); margin: 6px 0 16px; font-size: clamp(26px,3.4vw,36px); }
  .soon h1 { font-family: var(--font-display); color: var(--ink); font-size: clamp(30px,4vw,44px); margin: 6px 0 10px; }
  .hero-search { display: flex; gap: 10px; margin-bottom: 14px; }
  .hero-search input { flex: 1; border: 1px solid var(--border-strong); border-radius: 999px; padding: 13px 18px; font-size: 15px; font-family: var(--font-ui); }
  .hero-cta { display: flex; gap: 16px; align-items: center; margin-bottom: 24px; }
  .wishlist-link { font-size: 13.5px; color: var(--muted); font-family: var(--font-ui); }
  .occ-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 18px; }
  .occ-card { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 18px; text-align: left; font-family: var(--font-ui); }
  .occ-card:hover { border-color: var(--accent); } .occ-card b { display: block; color: var(--ink); font-size: 15px; } .occ-card span { color: var(--accent-dark); font-size: 13px; font-weight: 700; }
  .deal-card .ph { display: block; } .deal-name { text-decoration: none; } .deal-name:hover { text-decoration: underline; }
  .vbadge { background: var(--accent-soft); color: var(--accent-dark); font-size: 11px; padding: 2px 8px; border-radius: 999px; }
  .step-card { text-decoration: none; color: inherit; display: block; }
  details { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; font-size: 14px; }
  summary { font-weight: 700; color: var(--ink); cursor: pointer; } details p { color: var(--muted); line-height: 1.65; }
  @media (max-width: 960px) { .occ-grid { grid-template-columns: 1fr 1fr; } .hero-search { flex-direction: column; } }
</style>
