import type * as API from '@monolithe/api/types'
import type { Locale } from '@/types'
import { getPayload } from 'payload'
import { cached, tags } from '@/helpers/cache'
import config from '@payload-config'
import { contactSlug } from '@/helpers/slugify'

interface Props {
  locale: Locale
}

export const getContactData = async ({
  locale,
}: Props): Promise<{
  meta: API.Meta
  data: API.Contact.Data
}> => {
  return cached<{
    meta: API.Meta
    data: API.Contact.Data
  }>(async () => {
    const payload = await getPayload({
      config,
    })

    const [pageContact, general] = await Promise.all([
      payload.findGlobal({
        slug: 'pageContact',
        locale,
        draft: false,
      }),
      payload.findGlobal({
        slug: 'general',
        locale,
        draft: false,
      }),
    ])

    const { title, heroImage, name, place, email, phone, meta, form } = pageContact
    return {
      meta: {
        title: meta?.title ?? undefined,
        description: meta?.description ?? undefined,
        image: (meta?.image as API.Media) ?? undefined,
      },
      data: {
        hero: {
          title,
          image: heroImage as API.Media,
          slug: 'pageContact',
        },
        info: {
          logoCatch: general.footer.logoCatch ?? undefined,
          name: name ?? undefined,
          place: place ?? undefined,
          email: email ?? undefined,
          phone: phone ?? undefined,
        },
        form: {
          title: form?.title,
          introduction: form?.introduction ?? undefined,
          actionLabel: form?.actionLabel,
          successMessage: form?.successMessage,
          slug: contactSlug(form?.title),
        },
      },
    }
  }, tags.contact(locale))
}
