import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-responsive-carousel')) {
            return 'carousel';
          }
          if (id.includes('node_modules')) {
            if (
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('/react/')
            ) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('axios')) {
              return 'http';
            }
          }
        },
      },
    },
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
