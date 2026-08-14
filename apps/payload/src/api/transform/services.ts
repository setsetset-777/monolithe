import type * as API from '@monolithe/api/types'
import type { PageService, PageSlug, Service } from '@/types'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

export const transformServicesData = (
  { title: pageTitle, heroImage, sections }: PageService,
  slug: PageSlug,
): {
  meta: API.Meta
  data: API.Services.Data
} => {
  return {
    meta: {
      title: pageTitle,
    },
    data: {
      hero: {
        title: pageTitle,
        image: heroImage as API.Media,
        slug: slug,
      },
      sections: (sections || []).map((section) => {
        const { url, projectsUrl, description, slug } = section
        const service = section.service as Service
        const linkLabel =
          typeof section.linkLabel === 'string' && section.linkLabel !== ''
            ? section.linkLabel
            : undefined
        switch (section.blockType) {
          case 'singleLevelBlock':
            const { image } = section
            return {
              type: 'singleLevel',
              title: service.label!,
              text: convertLexicalToHTML({ data: description! }),
              url,
              projectsUrl,
              slug,
              linkLabel,
              image: image as API.Media,
            }

          case 'multiLevelBlock':
            const { subsections } = section
            return {
              type: 'multiLevel',
              title: service.label!,
              text: convertLexicalToHTML({ data: description! }),
              url,
              projectsUrl,
              slug,
              linkLabel,
              subsections: (subsections || []).map(({ title, image, description }) => {
                return {
                  title: title!,
                  image: image as API.Media,
                  text: convertLexicalToHTML({ data: description! }),
                }
              }),
            }
        }
      }),
    },
  }
}
