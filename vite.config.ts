import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    // Permite acesso de rede externa (necessário para alguns ambientes de cloud/container)
    server: {
      host: true,
    },
    define: {
      // Substituição segura de variáveis de ambiente
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env': JSON.stringify({}), 
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