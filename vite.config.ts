import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do diretório atual
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    // Garante caminhos absolutos para o deploy (crucial para Vercel)
    base: '/',
    server: {
      // Permite acesso externo (0.0.0.0), essencial para ambientes cloud/container
      host: true,
      port: 5173,
      strictPort: true,
    },
    define: {
      // Injeta a API Key de forma segura durante o build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Polyfill para evitar crashes em libs que esperam ambiente Node
      'process.env': {}, 
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false, // Desabilita sourcemaps em produção para economizar banda
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