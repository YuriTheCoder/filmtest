import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk - React and core libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI chunk - Framer Motion and Lucide icons
          'vendor-ui': ['framer-motion', 'lucide-react'],
          // Data chunk - TanStack Query and Zustand
          'vendor-data': ['@tanstack/react-query', 'zustand'],
          // Forms chunk - React Hook Form and Zod
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Toast notifications
          'vendor-toast': ['react-hot-toast'],
        },
      },
    },
  },
  // Enable caching
  cacheDir: '.vite',
});
