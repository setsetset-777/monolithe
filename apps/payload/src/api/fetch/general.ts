import { getRoutes } from '../../helpers/routes'
import type { PayloadRequest } from 'payload'
import type { Locale, GeneralResponse } from '@/types'

import { localization } from '@/i18n'

export const fetchGeneral = async (req: PayloadRequest): Promise<GeneralResponse> => {
  const locale = (req.locale as Locale) ?? localization.defaultLocale

  const [general, services, routes] = await Promise.all([
    req.payload.findGlobal({ slug: 'general' }),
    req.payload.findGlobal({ slug: 'pageServices' }),
    getRoutes(req.payload, locale),
  ])

  return {
    general,
    services,
    routes,
  }
}
