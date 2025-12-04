import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do diretório atual
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    // Garante caminhos absolutos para o deploy
    base: '/',
    server: {
      host: true,
      port: 5173,
      strictPort: true,
    },
    define: {
      // Injeta a API Key de forma segura. 
      // IMPORTANTE: Não sobrescrever 'process.env' inteiro, pois remove a chave injetada.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      emptyOutDir: true,
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