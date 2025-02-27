import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    host: true,
    port: 5173,
  },
});
