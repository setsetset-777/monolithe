import type * as API from '@monolithe/api/types'
import type { Locale } from '@/types'
import { getPayload } from 'payload'
import { cacheTag } from 'next/cache'
import { tags } from '@/helpers/cache'
import config from '@payload-config'

interface Props {
  locale: Locale
}

export const getContactData = async ({
  locale,
}: Props): Promise<{
  meta: API.Meta
  data: API.Contact.Data
}> => {
  'use cache'

  cacheTag(tags.contact(), tags.contactLocale(locale))

  const payload = await getPayload({
    config,
  })

  const [pageContact, general] = await Promise.all([
    payload.findGlobal({
      slug: 'pageContact',
      locale,
    }),
    payload.findGlobal({
      slug: 'general',
      locale,
    }),
  ])

  const { title, heroImage, place, email, phone } = pageContact
  return {
    meta: {
      title,
    },
    data: {
      hero: {
        title,
        image: heroImage as API.Media,
        slug: 'pageContact',
      },
      info: {
        logoCatch: general.footer.logoCatch ?? undefined,
        place: place ?? undefined,
        email: email ?? undefined,
        phone: phone ?? undefined,
      },
    },
  }
}
