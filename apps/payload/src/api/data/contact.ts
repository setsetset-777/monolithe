import type * as API from '@monolithe/api/types'
import type { Locale } from '@/types'
import type { BasePayload } from 'payload'

interface Props {
  payload: BasePayload
  locale: Locale
}

export const getContactData = async ({
  payload,
  locale,
}: Props): Promise<{
  meta: API.Meta
  data: API.Contact.Data
}> => {
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
