import type * as API from '@monolithe/api/types'
import type { Locale, PageService, PageSlug, Service } from '@/types'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { BasePayload } from 'payload'
import { getRoutes } from '@/helpers/routes'
import listPublishedCollection from '@/helpers/listPublishedCollection'

interface Props {
  payload: BasePayload
  locale: Locale
  res: PageService
}

export const formatServicesData = async ({
  res: { title: pageTitle, heroImage },
  locale,
  payload,
}: Props): Promise<{
  meta: API.Meta
  data: API.Services.Data
}> => {
  const [routes, services] = await Promise.all([
    getRoutes(payload, locale),
    listPublishedCollection({ slug: 'services', locale, payload }),
  ])
  return {
    meta: {
      title: pageTitle,
    },
    data: {
      hero: {
        title: pageTitle,
        image: heroImage as API.Media,
        slug: 'pageServices',
      },
      sections: services.docs.map((service) => {
        const { id, linkLabel, type, title, description, urlSlug } = service
        const projectsUrl = `${routes['pageProjects'].path}#${urlSlug}`
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
