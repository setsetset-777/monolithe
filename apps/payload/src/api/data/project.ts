import type * as API from '@monolithe/api/types'
import type { Locale, Media } from '@/types'
import { getRoutes } from '@/helpers/routes'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cached, tags } from '@/helpers/cache'

interface Props {
  id: string
  locale: Locale
}

export const getProjectData = async ({
  id,
  locale,
}: Props): Promise<{
  meta: API.Meta
  data: API.Project.Data
}> => {
  return cached<{
    meta: API.Meta
    data: API.Project.Data
  }>(
    async () => {
      const payload = await getPayload({
        config,
      })

      const [project, routes, pageProjects] = await Promise.all([
        payload.findByID({
          collection: 'projects',
          locale,
          id,
          draft: false,
        }),
        getRoutes(locale),
        payload.findGlobal({ slug: 'pageProjects', locale, draft: false }),
      ])

      const { title, mainImage, description, gallery, meta } = project

      return {
        meta: {
          title: meta?.title ?? undefined,
          description: meta?.description ?? undefined,
          image: (meta?.image as API.Media) ?? undefined,
        },
        data: {
          hero: {
            title,
            image: mainImage as API.Media,
            backLink: routes['pageProjects'].path,
            backLinkLabel: pageProjects.backLinkLabel ?? undefined,
            text: description ? convertLexicalToHTML({ data: description }) : undefined,
          },
          gallery:
            gallery?.map(({ image, fullwidth, description }) => ({
              image: image as Media,
              fullwidth: fullwidth ?? undefined,
              text: description ?? undefined,
            })) || [],
        },
      }
    },
    tags.project(id, locale),
  )
}
