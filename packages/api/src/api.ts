import { FetchData, PayloadConfig } from '@monolithe/payload'
import logger from '@monolithe/logger'

let token: string | null = null
let config: PayloadConfig = {
  enable: false,
  apiUrl: '',
  serviceUser: '',
  servicePassord: '',
  env: 'production',
}
const loginRetryLimit = 5
let loginRetry = loginRetryLimit

export const init = (initConfig: PayloadConfig) => {
  config = { ...config, ...initConfig }
}

const login = async (): Promise<boolean> => {
  try {
    const url = buildUrl({ slug: 'users/login' })

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: config.serviceUser,
        password: config.servicePassord,
      }),
    })

    if (!res.ok) {
      throw new Error(`Error while fetchin ${config.apiUrl}/users/login`)
    }

    const data = await res.json()
    token = data.token
    loginRetry = loginRetryLimit
    return true
  } catch (e) {
    loginRetry--
    logger.error('Login failed')

    if (loginRetry > 0) {
      logger.info(`Retry login, try ${loginRetry}`)
      login()
    } else {
      logger.info('Login retry reached limit')
      return false
    }
    throw e
  }
}

export const fetchPage = async (path: string): Promise<FetchData> => {
  if (!token) {
    await login()
  }

  const url = buildUrl({
    slug: 'page',
    params: {
      path,
    },
  })

  try {
    const data = await fetchApi(url)

    return data
  } catch (e) {
    throw e
  }
}

const fetchApi = async (url: string): Promise<FetchData> => {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: config.env !== 'development' ? `Bearer ${token}` : '',
      },
    })

    if (!res.ok) {
      throw new Error(`Fetch page to Payload failed for ${url}`)
    }

    // Unauthorized. Re-fetch token
    if (res.status === 401) {
      const loginSuccess = await login()
      if (loginSuccess) {
        fetchPage(url)
      } else {
        throw new Error('Login failed, unable to fetch page')
      }
    }

    return res.json()
  } catch (e) {
    console.error('Error while fetching API')
    throw e
  }
}

const buildUrl = ({ slug, params }: { slug: string; params?: Record<string, string> }) => {
  let url = `${config.apiUrl}/${slug}`

  if (params) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    url += `?${queryString}`
  }

  return url
}
