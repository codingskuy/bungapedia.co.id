// Bungapedia production server — Bun.serve() serving the Svelte (Vite) build.
// Dev:   bun run dev    (Vite HMR di :5173, serve public/ + src)
// Build: bun run build  (vite build → dist/)
// Serve: bun run serve [--port 3000]

import { serve, file } from 'bun';
import index from './dist/index.html';

function parsePort(): number {
  const i = Bun.argv.indexOf('--port');
  if (i >= 0 && Bun.argv[i + 1]) return Number(Bun.argv[i + 1]);
  return Number(process.env.PORT ?? 3000);
}

const server = serve({
  port: parsePort(),
  routes: {
    '/': index,
    '/api/health': () =>
      Response.json({ ok: true, brand: 'Bungapedia', domain: 'bungapedia.co.id' }),
    '/api/cutoff': () => {
      const now = new Date();
      const cut = new Date(now);
      cut.setHours(13, 0, 0, 0);
      if (cut.getTime() < now.getTime()) cut.setDate(cut.getDate() + 1);
      return Response.json({ cutoffWib: '13:00', msRemaining: cut.getTime() - now.getTime() });
    },
    // file statis hasil build (public/ → dist/): /assets/images/…, /favicon.png, …
    '/assets/*': async (req) => {
      const p = new URL(req.url).pathname.replace(/\.\./g, '');
      const f = file(`./dist${p}`);
      if (!(await f.exists())) return new Response('Not found', { status: 404 });
      return new Response(f);
    },
    '/favicon.png': async () => new Response(file('./dist/favicon.png')),
    // fallback SPA untuk hash-router & halaman dalam
    '/*': index,
  },
  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
    console: true,
  },
});

console.log(`✿ Bungapedia live at http://localhost:${server.port}`);
