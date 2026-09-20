import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    target: 'esnext',
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Pehle Lucide check karein taake generic 'react' isko na le urey
            if (id.includes('lucide-react')) {
              return 'icons'
            }
            if (id.includes('framer-motion')) {
              return 'motion'
            }
            if (
              id.includes('/react/') || 
              id.includes('/react-dom/') || 
              id.includes('/scheduler/')
            ) {
              return 'react-vendor'
            }
          }
        }
      }
    }
  }
})