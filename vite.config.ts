import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  // Project Pages: https://codingskuy.github.io/bungapedia.co.id/
  // Base harus nama repo agar asset ter-resolve di subpath.
  base: '/bungapedia.co.id/',
  plugins: [svelte()],
  server: {
    port: 5173
  }
})
