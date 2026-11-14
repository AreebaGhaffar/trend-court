import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built site also works from a subpath,
  // e.g. GitHub Pages at /trend-court/ as well as from a domain root.
  base: './',
  plugins: [react()],
})
