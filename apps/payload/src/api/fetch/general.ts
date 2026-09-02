import type { PayloadRequest } from 'payload'
import type { Locale } from '@/types'
import * as API from '@monolithe/api/types'

import { localization } from '@/i18n'
import { gaetGeneralData } from '../data'

export const fetchGeneral = async (req: PayloadRequest): Promise<API.General.Data> => {
  const locale = (req.locale as Locale) ?? localization.defaultLocale

  const data = await gaetGeneralData({ payload: req.payload, locale })

  return data
}
