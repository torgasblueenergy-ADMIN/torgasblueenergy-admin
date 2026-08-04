import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // public/ berisi symlink ke images/ dan cvs/ supaya aset tidak perlu diduplikasi
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Pisahkan React ke chunk sendiri supaya bisa di-cache lebih lama oleh browser
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom'] }
      }
    }
  },
  server: { port: 5173, open: true }
});
