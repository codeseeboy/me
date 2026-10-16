import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Three.js is its own lazy chunk (the hero ring) and loads after first
    // paint, so its size does not hold up the page.
    chunkSizeWarningLimit: 600,
  },
})
