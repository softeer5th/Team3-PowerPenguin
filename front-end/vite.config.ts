import fs from 'fs';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    host: 'front.softeer-reacton.shop',
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, 'front.softeer-reacton.shop-key.pem')
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, 'front.softeer-reacton.shop.pem')
      ),
    },
    proxy: {
      '/api': {
        target: 'https://softeer-reacton.shop',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    port: 5173,
  },
});
