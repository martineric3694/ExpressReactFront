import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // listen di 0.0.0.0 → bisa diakses dari LAN
    port: 5173,
  },
})
