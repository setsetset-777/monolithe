import type * as API from '@monolithe/api/types'
import type { Locale, Media, Project } from '@/types'
import { getRoutes } from '@/helpers/routes'
import { BasePayload } from 'payload'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

interface Props {
  payload: BasePayload
  locale: Locale
  res: Project
}

export const formatProjectData = async ({
  res: { title, mainImage, description, gallery },
  locale,
  payload,
}: Props): Promise<{
  meta: API.Meta
  data: API.Project.Data
}> => {
  const [routes, pageProjects] = await Promise.all([
    getRoutes(payload, locale),
    payload.findGlobal({ slug: 'pageProjects', locale }),
  ])
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
