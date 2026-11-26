import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { rollupOptions: { input: {
    portfolio: resolve(import.meta.dirname, 'index.html'),
    clipper: resolve(import.meta.dirname, 'clipper/index.html'),
  } } },
  worker: { format: 'es' },
})
