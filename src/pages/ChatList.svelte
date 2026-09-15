<!-- Daftar inbox — dipakai 3 portal dengan prop me yang berbeda. -->
<script lang="ts">
  import { kindLabel, threads, visibleThreads, type Me } from '../chat-store';

  export let me: Me;
  export let emptyHint = 'Belum ada percakapan. Mulai dari halaman pesanan via tombol Chat.';

  // $threads dibaca agar list ikut segar setiap ada pesan masuk
  $: list = ($threads, visibleThreads(me));
</script>

<div class="inbox" data-od-id="chat-list">
  {#if list.length === 0}
    <div class="empty"><b>Belum ada percakapan.</b><p>{emptyHint}</p></div>
  {:else}
    {#each list as t}
      <a class="trow" href="#/pesan/{t.id}" data-od-id="thread-{t.id}">
        <div class="av">{t.kind === 'admin-customer' ? '🛡' : t.kind === 'admin-partner' ? '🤝' : '💬'}</div>
        <div class="mid">
          <b>{t.title}</b>
          <small>{kindLabel(t.kind)}{t.orderId ? ` · ${t.orderId}` : ''}</small>
          <small class="last">{t.messages.length ? `${t.messages[t.messages.length - 1].name}: ${t.messages[t.messages.length - 1].text.slice(0, 60)}` : 'Belum ada pesan — mulai percakapan.'}</small>
        </div>
        <div class="right">
          <small>{t.updatedAt}</small>
          {#if t.unread[me.role] > 0}<span class="pill">{t.unread[me.role]}</span>{/if}
        </div>
      </a>
    {/each}
  {/if}
</div>

<style>
  .inbox { display: flex; flex-direction: column; gap: 10px; }
  .trow { display: flex; gap: 12px; align-items: center; background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 12px 16px 12px 12px; text-decoration: none; color: var(--ink); font-family: var(--font-ui); }
  .trow:hover { border-color: var(--accent); }
  .av { width: 46px; height: 46px; border-radius: 12px; background: var(--accent-soft); display: grid; place-items: center; font-size: 22px; flex: none; }
  .mid { flex: 1; min-width: 0; } .mid b { display: block; font-size: 14.5px; } .mid small { color: var(--muted); display: block; font-size: 12.5px; }
  .last { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .right { text-align: right; display: flex; flex-direction: column; gap: 6px; align-items: end; } .right small { color: var(--muted); font-size: 11.5px; }
  .pill { background: var(--danger); color: #fff; font-size: 11px; font-weight: 800; min-width: 20px; height: 20px; border-radius: 999px; display: grid; place-items: center; padding: 0 6px; }
  .empty { background: #fff; border: 1px dashed var(--border-strong); border-radius: 14px; padding: 32px; text-align: center; font-family: var(--font-ui); } .empty p { color: var(--muted); font-size: 14px; }
</style>
