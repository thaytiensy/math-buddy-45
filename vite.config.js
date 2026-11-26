import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import ttsHandler from './api/tts.js';

function localTtsPlugin() {
  const attachMiddleware = (middlewares) => {
    middlewares.use('/api/tts', (req, res) => {
      ttsHandler(req, res);
    });
  };
  return {
    name: 'local-vietnamese-tts',
    configureServer(server) {
      attachMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares);
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    localTtsPlugin(),
  ],
  server: {
    port: 4350,
    host: '0.0.0.0',
    strictPort: false,
  },
});
