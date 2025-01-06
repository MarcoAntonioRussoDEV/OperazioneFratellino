import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './of-frontend/src'),
    },
  },
  plugins: [react(), mkcert()],
  base: './',
  server: {
    port: 5173,
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
    },
    // https: false,
  },
});
