<!-- Formulir registrasi partner — halaman tersendiri di portal partner (#/daftar). -->
<script lang="ts">
  import { CATEGORIES } from '../market-data';
  import { submitApplication } from '../ops-store';

  let business = '';
  let owner = '';
  let email = '';
  let phone = '';
  let city = '';
  let areas = '';
  let cats: string[] = [];
  let description = '';
  let agree = false;
  let errors: Record<string, string> = {};
  let doneId: string | null = null;

  function toggleCat(c: string) {
    cats = cats.includes(c) ? cats.filter((x) => x !== c) : [...cats, c];
  }
  function submit(e: Event) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (business.trim().length < 3) er.business = 'Nama usaha minimal 3 karakter.';
    if (owner.trim().length < 3) er.owner = 'Nama pemilik minimal 3 karakter.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) er.email = 'Email tidak valid.';
    if (!/^(\+?62|0)8\d{7,11}$/.test(phone.replace(/[\s-]/g, ''))) er.phone = 'No. HP tidak valid. Contoh: 0812xxxxxxx.';
    if (!city.trim()) er.city = 'Isi kota operasional.';
    if (cats.length === 0) er.cats = 'Pilih minimal 1 kategori.';
    if (description.trim().length < 20) er.description = 'Ceritakan usahamu minimal 20 karakter.';
    if (!agree) er.agree = 'Centang persetujuan agar bisa dikirim.';
    errors = er;
    if (Object.keys(er).length > 0) return;
    doneId = submitApplication({ business: business.trim(), owner: owner.trim(), email: email.trim(), phone: phone.trim(), city: city.trim(), areas: areas.trim(), categories: cats, description: description.trim() });
  }
</script>

<div class="reg" data-od-id="partner-register">
  {#if doneId}
    <div class="done">
      <div class="check">✓</div>
      <p class="eyebrow">Pengajuan terkirim</p>
      <h1>Terima kasih, {owner}!</h1>
      <p class="lede">Pengajuan <b>{doneId}</b> untuk <b>{business}</b> masuk ke admin. Verifikasi 1–2 hari kerja — status bisa dipantau admin di tab Partner. Akun login diterbitkan setelah dokumen lolos (MVP: manual).</p>
      <p><a class="btn btn-primary" href="#/">Kembali ke portal →</a></p>
    </div>
  {:else}
    <p class="eyebrow">Registrasi partner · gratis</p>
    <h1>Daftarkan usahamu.</h1>
    <p class="lede">Isi sekali — admin memverifikasi sebelum katalogmu tayang ke customer.</p>
    <form class="card" on:submit={submit} novalidate>
      <div class="row">
        <div><label for="g-biz">Nama usaha</label><input id="g-biz" placeholder="cth. Mawar Jaya Florist" bind:value={business} />
        {#if errors.business}<small class="ferr">{errors.business}</small>{/if}</div>
        <div><label for="g-owner">Nama pemilik</label><input id="g-owner" placeholder="Nama lengkap" bind:value={owner} />
        {#if errors.owner}<small class="ferr">{errors.owner}</small>{/if}</div>
      </div>
      <div class="row">
        <div><label for="g-email">Email usaha</label><input id="g-email" type="email" placeholder="halo@tokomu.id" bind:value={email} />
        {#if errors.email}<small class="ferr">{errors.email}</small>{/if}</div>
        <div><label for="g-phone">No. HP / WA</label><input id="g-phone" inputmode="tel" placeholder="0812xxxxxxx" bind:value={phone} />
        {#if errors.phone}<small class="ferr">{errors.phone}</small>{/if}</div>
      </div>
      <div class="row">
        <div><label for="g-city">Kota operasional</label><input id="g-city" placeholder="cth. Jakarta Selatan" bind:value={city} />
        {#if errors.city}<small class="ferr">{errors.city}</small>{/if}</div>
        <div><label for="g-area">Area layanan</label><input id="g-area" placeholder="cth. Jabodetabek" bind:value={areas} /></div>
      </div>
      <fieldset class="catset"><legend>Kategori produk</legend>
      <div class="cats">
        {#each CATEGORIES as c}
          <button type="button" class="chip" class:on={cats.includes(c)} on:click={() => toggleCat(c)}>{c}</button>
        {/each}
      </div>
      </fieldset>
      {#if errors.cats}<small class="ferr">{errors.cats}</small>{/if}
      <label for="g-desc">Tentang usahamu</label>
      <textarea id="g-desc" rows="3" placeholder="Spesialisasi, kapasitas harian, sejak kapan…" bind:value={description}></textarea>
      {#if errors.description}<small class="ferr">{errors.description}</small>{/if}
      <label class="check"><input type="checkbox" bind:checked={agree} /> Data yang saya isi benar dan bersedia diverifikasi admin.</label>
      {#if errors.agree}<small class="ferr">{errors.agree}</small>{/if}
      <button class="btn btn-primary big" type="submit">Kirim pengajuan →</button>
    </form>
  {/if}
</div>

<style>
  .reg { max-width: 760px; margin: 0 auto; padding: 28px 24px 48px; font-family: var(--font-ui); }
  h1 { font-family: var(--font-display); color: var(--ink); margin: 6px 0 8px; font-size: clamp(30px,4vw,44px); }
  .lede { color: var(--muted); line-height: 1.65; }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 18px; padding: 24px; margin-top: 18px; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  label { display: block; font-size: 13px; font-weight: 700; color: var(--ink); margin: 12px 0 6px; }
  .catset { border: 0; padding: 0; margin: 12px 0 0; }
  .catset legend { font-size: 13px; font-weight: 700; color: var(--ink); padding: 0; margin-bottom: 6px; }
  input, textarea { width: 100%; border: 1px solid var(--border-strong); border-radius: 10px; padding: 11px 13px; font-size: 14px; font-family: var(--font-ui); color: var(--ink); }
  .ferr { color: var(--danger); font-size: 12.5px; font-weight: 600; }
  .cats { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
  .chip { border: 1px solid var(--border-strong); background: #fff; border-radius: 999px; padding: 8px 16px; font-size: 13px; font-weight: 600; color: var(--ink); }
  .chip.on { background: var(--ink); color: #fff; border-color: var(--ink); }
  .check { display: flex; gap: 8px; align-items: flex-start; font-weight: 500; color: var(--muted); margin-top: 14px; }
  .check input { width: auto; }
  .big { width: 100%; justify-content: center; margin-top: 18px; padding: 14px; }
  .done { text-align: center; padding: 32px 0; } .done h1 { margin-bottom: 10px; }
  .check { width: 64px; height: 64px; border-radius: 50%; background: var(--accent-soft); color: var(--accent-dark); font-size: 30px; font-weight: 800; display: grid; place-items: center; margin: 0 auto 16px; }
  @media (max-width: 640px) { .row { grid-template-columns: 1fr; } }
</style>
