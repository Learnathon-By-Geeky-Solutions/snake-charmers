import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    // eslint-disable-next-line no-undef
    port: process.env.VITE_PORT || 3000, // Default to 3000 if VITE_PORT is not defined
  },
});
