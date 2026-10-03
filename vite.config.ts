import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    proxy: {
      '/cpe-proxy': {
        target: 'http://192.168.8.1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cpe-proxy/, ''),
      },
    },
  },
});
