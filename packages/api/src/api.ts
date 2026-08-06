import type { FetchData, PageResponse, APIInitConfig, Locale, GeneralData } from './types'
import logger from '@monolithe/logger'

let token: string | null = null
let loginPromise: Promise<void> | null = null

let config: APIInitConfig = {
  enable: false,
  apiUrl: '',
  serviceUser: '',
  servicePassord: '',
  env: 'production',
}

init({
  enable: process.env.PAYLOAD_ENABLE === 'true',
  apiUrl: `${process.env.PAYLOAD_API_URL}`,
  serviceUser: `${process.env.PAYLOAD_SERVICE_USER}`,
  servicePassord: `${process.env.PAYLOAD_SERVICE_PASSWORD}`,
  env: `${process.env.NODE_ENV}` === 'development' ? 'development' : 'production',
})

export function init(initConfig: APIInitConfig) {
  config = {
    ...config,
    ...initConfig,
  }
}

async function fetchLogin() {
  const url = buildUrl({ slug: 'users/login' })

  logger.info(`Logging into Payload at ${url}`)

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
    throw new Error(`Unable to login (${res.status})`)
  }

  const data = await res.json()
  token = data.token

  logger.info('Payload login successful')
}

async function login(): Promise<void> {
  if (loginPromise) {
    return loginPromise
  }

  loginPromise = fetchLogin()

  try {
    await loginPromise
  } finally {
    loginPromise = null
  }
}

async function request<T>(url: string): Promise<T> {
  if (!token) {
    await login()
  }

  let res = await fetch(url, {
    headers: {
      Authorization: config.env === 'development' ? '' : `Bearer ${token}`,
    },
  })

  // Token expired: refresh once
  if (res.status === 401) {
    logger.info('Payload token expired. Refreshing.')

    token = null

    await login()

    res = await fetch(url, {
      headers: {
        Authorization: config.env === 'development' ? '' : `Bearer ${token}`,
      },
    })
  }

  if (!res.ok) {
    throw new Error(`Payload request failed (${res.status}) for ${url}`)
  }

  return res.json()
}

export async function fetchPage(path: string, locale?: Locale): Promise<PageResponse> {
  return request(
    buildUrl({
      slug: 'page',
      params: { path, locale },
    }),
  )
}

export async function fetchGeneral(locale?: Locale): Promise<GeneralData> {
  return request(
    buildUrl({
      slug: 'general',
      params: { locale },
    }),
  )
}

function buildUrl({ slug, params }: { slug: string; params?: Record<string, string | undefined> }) {
  const url = new URL(`${config.apiUrl}/${slug}`)

  if (params) {
    Object.entries(params).forEach(([k, v]) => typeof v === 'string' && url.searchParams.set(k, v))
  }

  return url.toString()
}
