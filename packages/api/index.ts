import logger from '@packages/logger'

import type { PayloadConfig, LocaleCode, LocalesData, FetchData } from './types.ts'

export { PayloadConfig, LocaleCode, LocalesData, FetchData }

let cachedToken: string | null = null
let tokenExpiresAt = 0

let config: PayloadConfig = {
  enable: false,
  apiUrl: '',
  serviceUser: '',
  servicePassord: '',
  env: 'production',
}

const init = (initConfig: PayloadConfig) => {
  config = { ...config, ...initConfig }
}

const getToken = async () => {
  if (!config.enable) {
    return null
  }

  const now = Date.now()

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken
  }

  try {
    const res = await fetch(`${config.apiUrl}/users/login`, {
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
      throw new Error('Failed to login to Payload')
    }

    const data = await res.json()
    cachedToken = data.token
    tokenExpiresAt = data.exp * 1000

    return cachedToken
  } catch (e) {
    logger.error('getToken failed')
    throw e
  }
}

/**
 * Fetches a record from PayloadCMS
 * Default to a collection type
 */
const fetchPayload = async ({
  slug,
  type,
  params,
}: {
  slug: string
  type?: 'global' | 'collection' | 'auth' | null
  params?: Record<string, unknown>
}): FetchData => {
  if (!config.enable) {
    throw 'No payload enabled. Fetch aborted.'
  }

  try {
    const token = await getToken()
    let path = '/'

    if (type === 'global') {
      path += 'globals/'
    }

    path += slug.replace(/.$\//, '')

    if (params && Object.keys(params).length > 0) {
      path += `?${Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join('&')}`
    }

    const url = `${config.apiUrl}${path}`

    logger.info(`Fetching data with ${url}`)

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: config.env !== 'development' ? `Bearer ${token}` : '',
      },
    })

    if (!res.ok) {
      throw `Something went wrong while fetching data with ${url}`
    }

    const data = await res.json()

    logger.info(`Data received for ${url}:`, data)

    return data
  } catch (e) {
    logger.error('fetchPayload failed')
    throw e
  }
}

/**
 * Fetches a global from PayloadCMS
 */
const fetchGlobal = async (path: string, params?: Record<string, unknown>): FetchData =>
  fetchPayload({ slug: path, type: 'global', params: { depth: 3, ...params } })

/**
 * Fetches a collection from PayloadCMS
 */
const fetchCollection = async (path: string, params?: Record<string, unknown>): FetchData =>
  fetchPayload({ slug: path, type: 'collection', params: { depth: 3, ...params } })

/**
 * Fetches a page from PayloadCMS
 */
const fetchPage = async (path: string, params?: Record<string, unknown>) => {
  return fetchGlobal(path, params) ?? fetchCollection(path, params)
}

/**
 * Fetches locales supported by PayloadCMS
 */
const fetchLocales = async (): Promise<LocalesData> =>
  fetchPayload({ slug: 'locales' }) as unknown as LocalesData

export default {
  init: init,
  fetch: fetchPayload,
  global: fetchGlobal,
  page: fetchPage,
  collection: fetchCollection,
  locales: fetchLocales,
}
