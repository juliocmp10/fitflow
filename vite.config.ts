import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo (development/production)
  // O terceiro argumento '' carrega todas as variáveis, não apenas as que começam com VITE_
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    // Define substitui 'process.env.API_KEY' pelo valor real da string durante o build
    // Isso é necessário porque o navegador não possui 'process.env'
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Garante que o objeto process.env vazio exista para evitar crash em outras libs
      'process.env': {}
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            charts: ['recharts'],
            ai: ['@google/genai'],
            icons: ['lucide-react']
          }
        }
      }
    }
  };
});