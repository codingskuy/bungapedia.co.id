<!-- Pendaftaran customer 2 langkah: data diri → verifikasi OTP (simulasi, kode demo ditampilkan). -->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import {
    OTP_TTL_MS,
    cancelRegistration,
    pendingInfo,
    requestOtp,
    resendOtp,
    verifyOtp,
  } from '../auth';

  let step: 1 | 2 = 1;
  let name = '';
  let email = '';
  let pass = '';
  let pass2 = '';
  let formError = '';

  let otp = '';
  let demoCode: string | null = null;
  let otpError = '';
  let remaining: number | null = null;
  let expiresAt = 0;
  let now = Date.now();
  let cooldownUntil = 0;
  let timer: ReturnType<typeof setInterval>;

  onMount(() => {
    timer = setInterval(() => {
      now = Date.now();
    }, 1000);
    const p = pendingInfo();
    if (p) {
      name = p.name;
      email = p.email;
      expiresAt = p.expiresAt;
      step = 2;
    }
  });
  onDestroy(() => clearInterval(timer));

  $: left = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  $: leftLabel = `${String(Math.floor(left / 60)).padStart(1, '0')}:${String(left % 60).padStart(2, '0')}`;
  $: coolLeft = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
  $: if (step === 2 && expiresAt > 0 && left === 0) otpError = 'Kode kedaluwarsa. Minta kode baru di bawah.';

  function submitForm(e: Event) {
    e.preventDefault();
    if (pass !== pass2) {
      formError = 'Konfirmasi password tidak sama.';
      return;
    }
    const r = requestOtp(name, email, pass);
    if (!r.ok) {
      formError = r.error ?? 'Gagal meminta kode.';
      return;
    }
    formError = '';
    demoCode = r.otp ?? null;
    expiresAt = Date.now() + OTP_TTL_MS;
    cooldownUntil = Date.now() + 30000;
    otp = '';
    otpError = '';
    step = 2;
  }
  function submitOtp(e: Event) {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      otpError = 'Kode OTP 6 digit.';
      return;
    }
    const r = verifyOtp(otp);
    if (r.ok) {
      location.hash = '#/akun';
    } else {
      otpError = r.error ?? 'Verifikasi gagal.';
      remaining = r.remaining ?? null;
    }
  }
  function resend() {
    const r = resendOtp();
    if (!r.ok) {
      otpError = r.error ?? 'Gagal mengirim ulang.';
      return;
    }
    demoCode = r.otp ?? null;
    expiresAt = Date.now() + OTP_TTL_MS;
    cooldownUntil = Date.now() + 30000;
    otpError = '';
    remaining = null;
  }
  function back() {
    cancelRegistration();
    step = 1;
    demoCode = null;
    otp = '';
    otpError = '';
  }
</script>

<div class="login-wrap" data-od-id="register-customer">
  <div class="login-card">
    {#if step === 1}
      <p class="eyebrow">Daftar akun customer · gratis</p>
      <h1>Buat akun <span class="acc">Bungapedia</span></h1>
      <form on:submit={submitForm} novalidate>
        <label for="rg-name">Nama lengkap</label>
        <input id="rg-name" placeholder="cth. Rina Amelia" bind:value={name} autocomplete="name" />
        <label for="rg-email">Email</label>
        <input id="rg-email" type="email" placeholder="nama@email.id" bind:value={email} autocomplete="email" />
        <div class="row">
          <div><label for="rg-pass">Password (min 6)</label><input id="rg-pass" type="password" bind:value={pass} autocomplete="new-password" /></div>
          <div><label for="rg-pass2">Ulangi password</label><input id="rg-pass2" type="password" bind:value={pass2} autocomplete="new-password" /></div>
        </div>
        {#if formError}<div class="err" role="alert">{formError}</div>{/if}
        <button class="btn btn-primary big" type="submit">Kirim kode OTP →</button>
      </form>
      <p class="swap">Sudah punya akun? <a href="#/masuk">Masuk →</a></p>
    {:else}
      <p class="eyebrow">Langkah 2/2 · verifikasi email</p>
      <h1>Cek kode <span class="acc">OTP</span></h1>
      <p class="lede">6 digit untuk <b>{email}</b> · kedaluwarsa dalam <b>{leftLabel}</b>.</p>
      {#if demoCode}
        <div class="demo-box" role="status">📩 <b>Kode OTP demo: {demoCode}</b><br /><small>Produksi: dikirim via email. Prototype: ditampilkan di sini agar bisa didemo.</small></div>
      {/if}
      <form on:submit={submitOtp} novalidate>
        <label for="rg-otp">Kode OTP</label>
        <input id="rg-otp" inputmode="numeric" maxlength={6} placeholder="••••••" bind:value={otp} class="otp" />
        {#if otpError}<div class="err" role="alert">{otpError}{#if remaining !== null} Sisa {remaining}× percobaan.{/if}</div>{/if}
        <button class="btn btn-primary big" type="submit">Verifikasi & buat akun →</button>
      </form>
      <div class="row2">
        {#if coolLeft > 0}
          <span class="mut">Kirim ulang dalam {coolLeft} dtk…</span>
        {:else}
          <button class="link-more" on:click={resend}>Kirim ulang kode</button>
        {/if}
        <button class="link-more" on:click={back}>← Ganti email</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .login-wrap { display: grid; place-items: center; padding: 40px 20px 56px; font-family: var(--font-ui); }
  .login-card { background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 34px 32px; max-width: 520px; width: 100%; box-shadow: 0 20px 50px rgba(28,36,21,.08); }
  .login-card h1 { font-family: var(--font-display); color: var(--ink); margin: 4px 0 16px; font-size: clamp(26px,3vw,34px); }
  .acc { color: var(--accent-dark); }
  .lede { color: var(--muted); font-size: 14px; line-height: 1.6; }
  label { display: block; font-size: 13px; font-weight: 700; color: var(--ink); margin: 12px 0 6px; }
  input { width: 100%; border: 1px solid var(--border-strong); border-radius: 10px; padding: 12px 14px; font-size: 15px; font-family: var(--font-ui); color: var(--ink); }
  .otp { font-size: 24px; letter-spacing: 0.4em; text-align: center; font-weight: 800; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .big { width: 100%; justify-content: center; margin-top: 18px; padding: 14px; font-size: 15px; }
  .err { background: #fdeee9; color: #8f2d17; border-radius: 10px; padding: 11px 14px; font-size: 13.5px; margin-top: 12px; }
  .demo-box { background: #fff8e6; border: 1px dashed #c9a227; border-radius: 12px; padding: 14px 16px; font-size: 15px; color: var(--ink); margin: 12px 0 4px; }
  .demo-box small { color: #6b4e0c; font-size: 12px; }
  .swap { text-align: center; font-size: 14px; color: var(--muted); margin-top: 16px; }
  .row2 { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }
  .row2 .link-more { border: 0; background: none; cursor: pointer; font-size: 13.5px; }
  .mut { color: var(--muted); font-size: 13px; }
  @media (max-width: 560px) { .row { grid-template-columns: 1fr; } }
</style>
