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
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (id.includes('react-router-dom') || id.includes('/react/') || id.includes('/scheduler/')) {
            return 'react'
          }
          if (id.includes('@tanstack/react-query') || id.includes('@tanstack/react-table')) {
            return 'data'
          }
          if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('sonner') || id.includes('class-variance-authority') || id.includes('clsx')) {
            return 'ui'
          }
          if (id.includes('recharts')) {
            return 'charts'
          }
          if (id.includes('@fullcalendar')) {
            return 'calendar'
          }
          if (id.includes('three') || id.includes('@react-three')) {
            return 'three'
          }
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
            return 'forms'
          }

          return 'vendor'
        },
      },
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
