import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    port: 5173, // 配置代理
    router: {}, plugins: [vue(),], resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }, server: {
        proxy: {
            '/api': { // 获取请求中带 /api 的请求
                target: 'https://frp-act.top:29659 ',  // 后台服务器的源
                // target: 'http://localhost:8080 ',
                changeOrigin: true,   // 修改源
                secure: false, // 忽略 SSL 证书错误
                rewrite: (path) => path.replace(/^\/api/, "")   //  /api 替换为空字符串
            }
        }
    },
})
