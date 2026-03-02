import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/web': { target: 'http://localhost:8070', changeOrigin: true },
      '/api': { target: 'http://localhost:8070', changeOrigin: true },
    }
  }
})


