import type { UserConfig } from 'vite'
import path from 'path'
import fs from 'fs'

const configPath = '../../config'
const clientConfig = JSON.parse(fs.readFileSync(path.resolve(configPath, 'client.json'), 'utf8'))

export default {
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, clientConfig.mainFile),
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'localhost',
    },
    origin: 'http://localhost:5173',
  },
} satisfies UserConfig
