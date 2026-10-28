import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    // three's WebGLRenderer alone is ~130 kB gzipped, so the default 500 kB warning always fires
    chunkSizeWarningLimit: 700,
  },
});
