import logger from '@monolithe/logger'
import { buildUrl, config } from '.'

export let token: string | null = null
let loginPromise: Promise<void> | null = null

/**
 * Call Payload for login
 */
export async function fetchLogin() {
  const url = buildUrl({ slug: 'users/login' })

  logger.info(`Logging into Payload at ${url}`)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: config.serviceUser,
      password: config.servicePassword,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')

    logger.error(`Unable to login (${res.status}): ${body}`)

    throw new Error(`Unable to login (${res.status})`)
  }

  const data = await res.json()
  token = data.token

  logger.info('Payload login successful')
}

/**
 * Wrap login fetch into a promise
 * @returns
 */
export async function login(): Promise<void> {
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

export function resetToken() {
  token = null
}
