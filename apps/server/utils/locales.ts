import payloader from '@monolithe/api'

type LocaleCode = string

export type Locales = {
  localeCodes: LocaleCode[]
  defaultLocale: LocaleCode
}

export const getLocales: () => Promise<Locales> = async () => {
  try {
    let locales = {
      localeCodes: ['en'],
      defaultLocale: 'en',
    }

    if (process.env.PAYLOAD_ENABLE) {
      locales = (await payloader.locales()) as Locales
    }

    return locales
  } catch (e) {
    throw e
  }
}
