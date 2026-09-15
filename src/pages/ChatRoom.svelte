<!-- Ruang chat 1 thread — dipakai 3 portal. Tombol simulasi diberi label jujur. -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { kindLabel, markRead, send, simulateReply, threads, type Me } from '../chat-store';

  export let threadId: string;
  export let me: Me;

  $: t = $threads.find((x) => x.id === threadId);
  let draft = '';
  let error = '';

  onMount(() => markRead(threadId, me.role));
  $: if (t) markRead(threadId, me.role);

  function submit(e: Event) {
    e.preventDefault();
    const r = send(threadId, me, draft);
    if (r.ok) {
      draft = '';
      error = '';
    } else {
      error = r.error ?? 'Gagal mengirim.';
    }
  }
  function sim() {
    simulateReply(threadId, me);
  }
</script>

{#if !t}
  <div class="container narrow" data-od-id="thread-missing">
    <p class="eyebrow">Percakapan tidak ditemukan</p>
    <h1>Thread “{threadId}” tidak ada</h1>
    <p class="lede">Mungkin ID salah atau data browser ter-reset.</p>
    <p><a class="btn btn-primary" href="#/pesan">Kembali ke inbox →</a></p>
  </div>
{:else}
  <div class="room" data-od-id="room-{t.id}">
    <div class="rhead">
      <a class="btn btn-sm" href="#/pesan">← Inbox</a>
      <div><b>{t.title}</b><small>{kindLabel(t.kind)}{t.orderId ? ` · konteks ${t.orderId}` : ''}</small></div>
    </div>
    <div class="msgs">
      {#if t.messages.length === 0}
        <p class="mut" style="text-align:center">Belum ada pesan. Sapa dulu — balasan tercatat untuk kedua pihak.</p>
      {/if}
      {#each t.messages as m}
        <div class="bubble" class:mine={m.from === me.role}>
          <small>{m.name} · {m.at}{#if m.sim} · ⚡simulasi{/if}</small>
          <p>{m.text}</p>
        </div>
      {/each}
    </div>
    {#if error}<div class="err" role="alert">{error}</div>{/if}
    <form class="composer" on:submit={submit}>
      <input type="text" placeholder="Tulis pesan… (maks 500 karakter)" bind:value={draft} maxlength={520} aria-label="Tulis pesan" />
      <button class="btn btn-primary" type="submit">Kirim</button>
    </form>
    <button class="link-more" on:click={sim}>⚡ Minta balasan simulasi (untuk demo alur)</button>
  </div>
{/if}

<style>
  .narrow { max-width: 720px; margin: 0 auto; padding: 32px 24px 48px; font-family: var(--font-ui); }
  .narrow h1 { font-family: var(--font-display); color: var(--ink); } .lede { color: var(--muted); }
  .room { max-width: 760px; margin: 0 auto; padding: 20px 24px 40px; font-family: var(--font-ui); }
  .rhead { display: flex; gap: 12px; align-items: center; margin-bottom: 14px; }
  .rhead b { display: block; color: var(--ink); font-size: 16px; } .rhead small { color: var(--muted); font-size: 12.5px; }
  .msgs { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 10px; min-height: 280px; max-height: 480px; overflow: auto; }
  .bubble { max-width: 78%; background: var(--bg); border: 1px solid var(--border); border-radius: 4px 14px 14px 14px; padding: 10px 14px; align-self: flex-start; }
  .bubble.mine { align-self: flex-end; background: var(--accent-soft); border-color: #cfe3b8; border-radius: 14px 4px 14px 14px; }
  .bubble small { color: var(--muted); font-size: 11px; display: block; margin-bottom: 3px; }
  .bubble p { margin: 0; font-size: 14.5px; line-height: 1.55; color: var(--ink); }
  .composer { display: flex; gap: 10px; margin-top: 12px; }
  .composer input { flex: 1; border: 1px solid var(--border-strong); border-radius: 999px; padding: 12px 18px; font-size: 14.5px; font-family: var(--font-ui); }
  .err { background: #fdeee9; color: #8f2d17; border-radius: 10px; padding: 10px 14px; font-size: 13px; margin-top: 10px; }
  .mut { color: var(--muted); font-size: 13.5px; }
  .room .link-more { margin-top: 10px; border: 0; background: none; cursor: pointer; font-size: 13px; }
</style>
