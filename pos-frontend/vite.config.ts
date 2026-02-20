import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    host: '0.0.0.0', // 👈 Allow access from LAN
    port: 5173,
    // strictPort: true,
    // allowedHosts: ['192.168.0.113', '127.0.0.1', 'localhost'],
  }
})
