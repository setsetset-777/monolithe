import type * as API from '@monolithe/api/types'
import type { Locale } from '@/types'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { getRoutes } from '@/helpers/routes'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { cacheTag } from 'next/cache'
import { tags } from '@/helpers/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

interface Props {
  locale: Locale
}

export const getServicesData = async ({
  locale,
}: Props): Promise<{
  meta: API.Meta
  data: API.Services.Data
}> => {
  'use cache'

  cacheTag(tags.services(), tags.servicesLocale(locale))

  const payload = await getPayload({
    config,
  })

  const [pageServices, routes, services] = await Promise.all([
    payload.findGlobal({
      slug: 'pageServices',
      locale,
    }),
    getRoutes(locale),
    listPublishedCollection({ slug: 'services', locale, payload }),
  ])

  const { title, heroImage, meta } = pageServices
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
        slug: 'pageServices',
      },
      sections: services.docs.map((service) => {
        const { id, linkLabel, type, title, description, urlSlug } = service
        const servicesParams = new URLSearchParams()
        servicesParams.append('service', urlSlug)
        const projectsUrl = `${routes['pageProjects'].path}?${servicesParams.toString()}#services`
        const data = {
          title,
          text: convertLexicalToHTML({ data: description }),
          url: routes[id].path,
          projectsUrl,
          slug: urlSlug,
          linkLabel: linkLabel ?? undefined,
        }
        switch (type) {
          case 'singleLevel':
            return {
              ...data,
              type,
              image: service.singleLevelBlock?.image as API.Media,
            }

          case 'multiLevel':
            return {
              ...data,
              type,
              subsections: (service.multiLevelBlock?.subsections || []).map(
                ({ title, image, description }) => {
                  return {
                    title: title,
                    image: image as API.Media,
                    text: convertLexicalToHTML({ data: description }),
                  }
                },
              ),
            }
        }
      }),
    },
  }
}
