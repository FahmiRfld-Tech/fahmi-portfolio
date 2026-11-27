import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolveSiteUrl, siteMetadata } from './site.config.js'

const currentVercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
const origin = resolveSiteUrl(process.env.PORTFOLIO_SITE_URL ?? (currentVercelHost ? 'https://' + currentVercelHost : undefined))

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMetadata(origin)],
  build: { rollupOptions: { input: {
    portfolio: resolve(import.meta.dirname, 'index.html'),
    clipper: resolve(import.meta.dirname, 'clipper/index.html'),
  } } },
  worker: { format: 'es' },
})
