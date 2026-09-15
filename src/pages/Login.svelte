<!-- Kartu login reusable per portal. Event `success` setelah sesi tersimpan. -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ADMIN_ACCOUNTS, CUSTOMER_ACCOUNTS, PARTNER_ACCOUNTS, login, type Role } from '../auth';

  export let role: Role;
  export let title = 'Masuk';
  export let subtitle = '';
  export let accentWord = '';

  const dispatch = createEventDispatcher<{ success: void }>();
  const HINTS: Record<Role, { email: string; label: string }[]> = {
    customer: CUSTOMER_ACCOUNTS.slice(0, 3).map((a) => ({ email: a.email, label: a.name })),
    partner: PARTNER_ACCOUNTS.map((a) => ({ email: a.email, label: a.name })),
    admin: ADMIN_ACCOUNTS.map((a) => ({ email: a.email, label: a.name })),
  };

  let email = '';
  let pass = '';
  let error = '';
  let busy = false;

  function fill(e: string) {
    email = e;
    pass = 'demo123';
    error = '';
  }
  function submit(e: Event) {
    e.preventDefault();
    if (!email.trim() || !pass) {
      error = 'Isi email dan password dulu.';
      return;
    }
    busy = true;
    const r = login(role, email, pass);
    busy = false;
    if (r.ok) {
      error = '';
      dispatch('success');
    } else {
      error = r.error ?? 'Login gagal.';
    }
  }
</script>

<div class="login-wrap" data-od-id="login-{role}">
  <div class="login-card">
    <p class="eyebrow">{subtitle || (role === 'customer' ? 'Akun customer' : role === 'partner' ? 'Portal partner' : 'Portal owner')}</p>
    <h1>{title} {#if accentWord}<span class="acc">{accentWord}</span>{/if}</h1>
    <form on:submit={submit} novalidate>
      <label for="login-email-{role}">Email</label>
      <input id="login-email-{role}" type="email" autocomplete="username" placeholder="nama@demo.id" bind:value={email} />
      <label for="login-pass-{role}">Password</label>
      <input id="login-pass-{role}" type="password" autocomplete="current-password" placeholder="••••••" bind:value={pass} />
      {#if error}<div class="err" role="alert">{error}</div>{/if}
      <button class="btn btn-primary big" type="submit" disabled={busy}>{busy ? 'Memeriksa…' : 'Masuk →'}</button>
    </form>
    {#if role === 'customer'}
      <p class="swap">Belum punya akun? <a href="#/daftar">Daftar dengan email →</a></p>
    {/if}
    <div class="hint">
      <b>Akun demo — klik untuk isi otomatis</b>
      <div class="chips">
        {#each HINTS[role] as h}
          <button class="chip" on:click={() => fill(h.email)} title={h.email}>{h.label}<small>{h.email}</small></button>
        {/each}
      </div>
      <small>Password semua akun: <b>demo123</b></small>
    </div>
  </div>
</div>

<style>
  .login-wrap { display: grid; place-items: center; padding: 40px 20px 56px; font-family: var(--font-ui); }
  .login-card { background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 34px 32px; max-width: 520px; width: 100%; box-shadow: 0 20px 50px rgba(28,36,21,.08); }
  .login-card h1 { font-family: var(--font-display); color: var(--ink); margin: 4px 0 16px; font-size: clamp(26px,3vw,34px); }
  .acc { color: var(--accent-dark); }
  label { display: block; font-size: 13px; font-weight: 700; color: var(--ink); margin: 12px 0 6px; }
  input { width: 100%; border: 1px solid var(--border-strong); border-radius: 10px; padding: 12px 14px; font-size: 15px; font-family: var(--font-ui); color: var(--ink); }
  .big { width: 100%; justify-content: center; margin-top: 18px; padding: 14px; font-size: 15px; }
  .err { background: #fdeee9; color: #8f2d17; border-radius: 10px; padding: 11px 14px; font-size: 13.5px; margin-top: 12px; }
  .hint { margin-top: 20px; border-top: 1px dashed var(--border-strong); padding-top: 16px; }
  .hint b { font-size: 13px; color: var(--ink); }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; }
  .chip { border: 1px solid var(--border-strong); background: var(--bg); border-radius: 10px; padding: 8px 12px; font-size: 12.5px; font-weight: 700; color: var(--ink); text-align: left; }
  .chip:hover { border-color: var(--accent); }
  .chip small { display: block; font-weight: 500; color: var(--muted); font-size: 11px; }
  .hint > small { color: var(--muted); font-size: 12.5px; }
  .swap { text-align: center; font-size: 14px; color: var(--muted); margin: 16px 0 0; }
</style>
