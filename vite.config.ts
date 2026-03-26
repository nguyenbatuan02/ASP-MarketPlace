import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/web': { target: 'http://103.214.9.199:8069/', changeOrigin: true},
      '/api': { target: 'http://103.214.9.199:8069/', changeOrigin: true},
    }
  }
})


