import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Aumenta o limite de aviso para 1600kb para silenciar o aviso "chunk size limit"
    // Isso não afeta a performance, apenas silencia o aviso no console de build
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Força a separação de bibliotecas grandes em arquivos separados
        // Isso ajuda o navegador a carregar o app mais rápido (cache)
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          ai: ['@google/genai'],
          icons: ['lucide-react']
        }
      }
    }
  }
});