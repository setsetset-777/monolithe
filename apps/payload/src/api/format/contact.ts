import type * as API from '@monolithe/api/types'
import type { Locale, PageContact, PageSlug } from '@/types'
import type { BasePayload } from 'payload'

export const formatContactData = async ({
  res: { title, heroImage, place, email, phone },
  payload,
  locale,
}: {
  res: PageContact
  payload: BasePayload
  locale: Locale
}): Promise<{
  meta: API.Meta
  data: API.Contact.Data
}> => {
  const general = await payload.findGlobal({
    slug: 'general',
    locale,
  })
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
