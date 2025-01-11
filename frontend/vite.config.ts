// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    },
    watch: {
      usePolling: true
    },
    hmr: {
      overlay: true
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
  build: {
    sourcemap: true,
    outDir: 'dist'
  },
  define: {
    'process.env.VITE_API_URL': process.env.NODE_ENV === 'production' 
      ? JSON.stringify('/api/v1') 
      : JSON.stringify('http://localhost:8000')  // Development URL
  },
  logLevel: 'info'
})