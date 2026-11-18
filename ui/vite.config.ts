import { fileURLToPath, URL } from 'node:url'

import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

const plugins = [] as  Required<UserConfig>['plugins']

plugins.push(vue())
plugins.push(tailwindcss())

if (process.env.VUE_DEVTOOLS) {
  plugins.push(vueDevTools())
}

// https://vite.dev/config/
export default defineConfig({
  root: import.meta.dirname,
  plugins,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
