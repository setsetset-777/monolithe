import type * as API from '@monolithe/api/types'
import type { Locale, Media } from '@/types'
import { getRoutes } from '@/helpers/routes'
import { BasePayload } from 'payload'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

interface Props {
  id: string
  payload: BasePayload
  locale: Locale
}

export const getProjectData = async ({
  id,
  locale,
  payload,
}: Props): Promise<{
  meta: API.Meta
  data: API.Project.Data
}> => {
  const [project, routes, pageProjects] = await Promise.all([
    payload.findByID({
      collection: 'projects',
      locale,
      id,
    }),
    getRoutes(payload, locale),
    payload.findGlobal({ slug: 'pageProjects', locale }),
  ])

  const { title, mainImage, description, gallery } = project

  return {
    meta: {
      title,
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
}
