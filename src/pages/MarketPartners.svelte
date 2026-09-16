<!-- Daftar + profil partner — transparansi partner (diferensiasi PRD §13/25). -->
<script lang="ts">
  import { PARTNERS, rp } from '../market-data';
  import { catalog } from '../ops-store';
  import type { MarketProduct, Partner } from '../market-types';
  export let partner: Partner | undefined = undefined;
  export let listMode = false;
  let allProds: MarketProduct[] = [];
  catalog.subscribe((v) => (allProds = v));
  $: prods = partner ? allProds.filter((p) => p.partnerId === partner!.id) : [];
  $: countOf = (pid: string) => allProds.filter((p) => p.partnerId === pid).length;
</script>

{#if listMode}
  <div class="container plist" data-od-id="partner-list">
    <p class="eyebrow">{PARTNERS.length} partner · {PARTNERS.filter((p) => p.verified).length} terverifikasi</p>
    <h1>Kenali siapa yang merangkai bungamu.</h1>
    <p class="lede">Customer membeli via platform — tapi diyakinkan oleh partner. Verifikasi dikontrol admin.</p>
    <div class="pgrid">
      {#each PARTNERS as p}
        <a class="pcard" href="#/partner/{p.id}" data-od-id="partner-{p.id}">
          <div class="cover"><img src={p.cover} alt={p.name} loading="lazy" />{#if p.verified}<span class="vflag">✓ Verified Partner</span>{:else}<span class="vflag pending">Menunggu verifikasi</span>{/if}</div>
          <div class="tx"><b>{p.name}</b><small>{p.city} · sejak {p.since}</small>
            <div class="stats">★ {p.rating} ({p.reviews}) · {(p.orders / 1000).toFixed(1)}K order · {p.responseRate}% respon</div>
            <div class="meta">{countOf(p.id)} produk · {p.productionTime} · {p.area[0]}</div>
          </div>
        </a>
      {/each}
    </div>
  </div>
{:else if partner}
  <div class="container pprof" data-od-id="partner-detail-{partner.id}">
    <nav class="crumb"><a href="#/">Beranda</a> / <a href="#/partner">Partner</a> / <span>{partner.name}</span></nav>
    <div class="hero"><img src={partner.cover} alt={partner.name} />
      <div class="ov"><img class="logo" src={partner.logo} alt="" />
        <div><h1>{partner.name} {#if partner.verified}<span class="vflag">✓ Verified Partner</span>{/if}</h1>
        <p>{partner.city} · sejak {partner.since} · respon {partner.responseRate}% · {partner.productionTime}</p></div>
      </div>
    </div>
    <div class="cols">
      <div>
        <div class="card"><h3>Tentang partner</h3><p>{partner.description}</p>
          <div class="kpis"><div><b>★ {partner.rating}</b><span>{partner.reviews} ulasan</span></div><div><b>{(partner.orders / 1000).toFixed(1)}K</b><span>order selesai</span></div><div><b>{partner.responseRate}%</b><span>respon</span></div><div><b>{partner.area.length} area</b><span>{partner.area.join(', ')}</span></div></div>
        </div>
        <h3 class="sec">Katalog {partner.name} ({prods.length})</h3>
        <div class="mgrid">
          {#each prods as p}
            <a class="mcard" href="#/produk/{p.id}"><img src={p.img} alt={p.name} /><b class="ptitle-2">{p.name}</b><span>{rp(p.price)} · ★ {p.rating}</span></a>
          {/each}
        </div>
      </div>
      <aside class="card side">
        <h3>Kenapa aman pesan via Bungapedia?</h3>
        <ul><li>🛡 Pembayaran via platform, status Pending hingga selesai</li><li>📍 Produksi oleh {partner.name}, dimonitor platform</li><li>💬 Komplain dimediasi admin 1×24 jam</li></ul>
        <a class="btn btn-primary" style="width:100%;justify-content:center" href="#/produk">Lihat katalog →</a>
      </aside>
    </div>
  </div>
{/if}

<style>
  .plist, .pprof { padding: 28px 24px 48px; max-width: 1180px; margin: 0 auto; font-family: var(--font-ui); }
  h1 { font-family: var(--font-display); color: var(--ink); font-size: clamp(28px,3.6vw,40px); margin: 6px 0 8px; }
  .lede { color: var(--muted); } .crumb { font-size: 13px; color: var(--muted); margin-bottom: 14px; } .crumb a { color: var(--accent-dark); text-decoration: none; }
  .pgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 20px; }
  .pcard { background: #fff; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; text-decoration: none; color: var(--ink); }
  .cover { position: relative; aspect-ratio: 16/8; background: #efe9dc; } .cover img { width: 100%; height: 100%; object-fit: cover; }
  .vflag { position: absolute; left: 12px; bottom: 12px; background: #fff; color: var(--accent-dark); font-size: 11.5px; font-weight: 800; padding: 5px 11px; border-radius: 999px; }
  .vflag.pending { color: var(--danger); } .tx { padding: 14px 16px 16px; } .tx small { color: var(--muted); display: block; } .stats { font-size: 13px; font-weight: 700; margin-top: 6px; } .meta { font-size: 12.5px; color: var(--muted); margin-top: 4px; }
  .hero { position: relative; border-radius: 18px; overflow: hidden; } .hero > img { width: 100%; height: 260px; object-fit: cover; }
  .ov { position: absolute; left: 18px; right: 18px; bottom: 18px; background: rgba(255,255,255,.94); border-radius: 14px; padding: 14px 18px; display: flex; gap: 14px; align-items: center; }
  .logo { width: 64px; height: 64px; border-radius: 14px; object-fit: cover; } .ov h1 { font-size: 24px; margin: 0; } .ov p { margin: 4px 0 0; color: var(--muted); font-size: 13px; }
  .cols { display: grid; grid-template-columns: 1.2fr .8fr; gap: 18px; margin-top: 18px; align-items: start; }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 20px 22px; } .card h3 { font-family: var(--font-display); color: var(--ink); margin: 0 0 8px; } .card p { color: #4b5563; line-height: 1.65; font-size: 14.5px; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 14px; } .kpis b { display: block; font-size: 17px; color: var(--ink); } .kpis span { font-size: 12px; color: var(--muted); }
  .sec { margin: 22px 0 12px; font-family: var(--font-display); color: var(--ink); } .mgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .mcard { background: #fff; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; text-decoration: none; color: var(--ink); } .mcard img { width: 100%; aspect-ratio: 1; object-fit: cover; } .mcard b { display: block; font-size: 13px; padding: 10px 12px 0; } .mcard span { display: block; font-size: 12.5px; color: var(--muted); padding: 2px 12px 12px; }
  .side ul { margin: 0 0 16px; padding-left: 18px; color: #4b5563; font-size: 14px; line-height: 1.7; }
  @media (max-width: 960px) { .pgrid, .mgrid { grid-template-columns: 1fr 1fr; } .cols { grid-template-columns: 1fr; } .kpis { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 640px) { .pgrid, .mgrid { grid-template-columns: 1fr; } }
</style>
