import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import payloader from '@packages/api'
import logger from '@packages/logger'

import { initRouter } from './routes/index.ts'
import { clientAssetsPath, getAssetsDetails, clientDistPath } from './utils/index.ts'

const { mainJs, mainCss } = getAssetsDetails(clientDistPath)
const vitePort = process.env.VITE_PORT ?? '5173'

payloader.init({
  enable: process.env.PAYLOAD_ENABLE === 'true',
  apiUrl: `${process.env.PAYLOAD_API_URL}`,
  serviceUser: `${process.env.PAYLOAD_SERVICE_USER}`,
  servicePassord: `${process.env.PAYLOAD_SERVICE_PASSWORD}`,
  env: `${process.env.NODE_ENV}` === 'development' ? 'development' : 'production',
})

const app = express()

app.locals.mainJs =
  process.env.NODE_ENV === 'development' ? `http://localhost:${vitePort}/src/js/main.ts` : mainJs
// In development styles are inject by vite via the above script
app.locals.mainCss = process.env.NODE_ENV !== 'development' ? mainCss : null
app.locals.analytics = {
  enable: process.env.ANALYTICS_ENABLE === 'true',
  domain: process.env.ANALYTICS_DOMAIN,
  id: process.env.ANALYTICS_ID,
}

const router = await initRouter()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = parseInt(process.env.SERVER_PORT as string) || 3000

app.use(express.static(path.join(__dirname, '../public')))

app.use('/assets', express.static(clientAssetsPath))

app.set('view engine', 'ejs')

app.set('views', __dirname + '/views')

app.use(router)

app.listen(port, '0.0.0.0', () => {
  logger.info(`Server running at http://localhost:${port}/`)
})
