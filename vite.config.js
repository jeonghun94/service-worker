import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  // build: {
  //   rollupOptions: {
  //     output: {
  //       assetsDir: "public", // 'public' 디렉토리를 설정합니다.
  //     },
  //   },
  // },
});
