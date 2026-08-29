import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // Meet Dreams call signaling — proxied to apps/realtime (standalone,
      // no database dependency). Run `npm run dev` in apps/realtime too.
      '/ws': {
        target: 'ws://localhost:4001',
        ws: true,
      },
    },
  },
})
