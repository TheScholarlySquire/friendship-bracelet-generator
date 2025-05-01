import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  return {
      base: mode === 'production' ? '/friendship-bracelet-generator/' : '/',
      plugins: [
          react(),
          tailwindcss(),
      ],
  };
});
