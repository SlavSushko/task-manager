import { defineConfig } from 'vite';

export default defineConfig({
  base: '/task-manager/',
  server: {
    port: 3000,
    open: true
  }
});