import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // arquivos pequenos continuam com nome próprio (o modo escuro usa o nome pra decidir o filtro dos ícones)
  build: { assetsInlineLimit: 0 },
})
