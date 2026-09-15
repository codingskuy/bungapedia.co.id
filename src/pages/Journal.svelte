<!-- Blog + Perpustakaan Bunga dalam satu halaman tab. -->
<script lang="ts">
  import { POSTS, LIBRARY } from '../data';
  import { showToast } from '../store';
  let tab: 'blog' | 'library' = 'blog';
</script>

<div class="container page" data-od-id="journal-page">
  <p class="eyebrow">Belajar & terhubung</p>
  <h1>Blog & Perpustakaan Bunga</h1>
  <div class="tabs" role="tablist">
    <button role="tab" aria-selected={tab === 'blog'} class:on={tab === 'blog'} on:click={() => (tab = 'blog')}>Blog</button>
    <button role="tab" aria-selected={tab === 'library'} class:on={tab === 'library'} on:click={() => (tab = 'library')}>Perpustakaan Bunga</button>
  </div>

  {#if tab === 'blog'}
    <div class="post-grid">
      {#each POSTS as p}
        <article class="post-card" data-od-id="post-{p.id}">
          <div class="ph"><img src={p.img} alt={p.title} loading="lazy" /></div>
          <div class="tx">
            <span class="kicker">{p.cat} · {p.date}</span>
            <b>{p.title}</b>
            <p>{p.excerpt}</p>
            <button class="link-more" on:click={() => showToast('Artikel penuh segera terbit di blog')}>Baca →</button>
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <div class="lib-grid">
      {#each LIBRARY as l}
        <article class="lib-card" data-od-id="lib-{l.name}">
          <img src={l.img} alt={l.name} loading="lazy" />
          <div class="tx">
            <b>{l.name}</b>
            <span class="latin"><em>{l.latin}</em> · vas {l.vaseLife}</span>
            <p>{l.note}</p>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>

<style>
  .page { padding-top: 32px; padding-bottom: 40px; }
  .page h1 { font-family: var(--font-display); color: var(--ink); font-size: clamp(28px, 3.6vw, 38px); margin: 6px 0 18px; }
  .tabs { display: flex; gap: 8px; margin-bottom: 22px; font-family: var(--font-ui); }
  .tabs button { border: 1px solid var(--border-strong); background: #fff; color: var(--ink); border-radius: 999px; padding: 10px 22px; font-size: 14px; font-weight: 700; }
  .tabs button.on { background: var(--ink); color: #fff; border-color: var(--ink); }
  .post-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .post-card { background: #fff; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; font-family: var(--font-ui); }
  .post-card .ph { aspect-ratio: 16/9; background: #efe9dc; overflow: hidden; }
  .post-card img { width: 100%; height: 100%; object-fit: cover; }
  .post-card .tx { padding: 16px 18px 18px; }
  .kicker { font-size: 11.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent-dark); }
  .post-card b { display: block; color: var(--ink); font-size: 16px; margin: 6px 0; line-height: 1.4; }
  .post-card p { color: var(--muted); font-size: 14px; line-height: 1.6; }
  .link-more { border: 0; background: none; padding: 0; }
  .lib-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .lib-card { background: #fff; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; font-family: var(--font-ui); }
  .lib-card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; background: #efe9dc; }
  .lib-card .tx { padding: 16px 18px 18px; }
  .lib-card b { color: var(--ink); font-size: 16px; }
  .latin { display: block; font-size: 12.5px; color: var(--accent-dark); margin: 4px 0 6px; }
  .lib-card p { color: var(--muted); font-size: 13.5px; line-height: 1.6; margin: 0; }
  @media (max-width: 960px) { .post-grid, .lib-grid { grid-template-columns: 1fr; } }
</style>
