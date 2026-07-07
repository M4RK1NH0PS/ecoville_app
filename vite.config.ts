import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: ['**/*.pdf', '**/LOGO_ECOVILLE_SMART.png', '**/public/catalogos/**'],
    },
  },
})
