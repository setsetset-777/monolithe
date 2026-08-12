import type { Presentation, Parution, Testimonial } from '../types'
import type { Payload } from '../types/payload'

export const transformPresentationData = (
  { title: heroTitle, heroImage, monolithePresentation, sections }: Payload.PagePresentation,
  slug: Payload.PageSlug,
): Presentation.Data => {
  return {
    hero: {
      title: heroTitle,
      image: heroImage as Payload.Media,
      slug: slug,
    },
    presentation: monolithePresentation!,
    sections: (sections ?? []).map((section): Presentation.Section => {
      const { title } = section
      switch (section.blockType) {
        case 'textWithTitleBlock':
          const { text, image } = section
          return {
            type: section.blockType,
            title: title!,
            text: text!,
            image: image as Payload.Media,
          }
        case 'listBlock':
          const { values } = section
          return {
            type: section.blockType,
            title: title!,
            values: (values ?? []).map(({ title }) => ({
              title: title!,
            })),
          }
        case 'parutionsBlock':
          const { parutionList } = section
          return {
            type: section.blockType,
            title: title!,
            list: (parutionList ?? []).map(({ parution }) => {
              const { title, publisher, type, date, link, thumbnail } = parution as Parution
              return {
                title: title!,
                publisher: publisher!,
                type: type!,
                date: date!,
                link: link!,
                thumbnail: thumbnail as Payload.Media,
              }
            }),
          }
        case 'testimonialsBlock':
          const { testimonialsList } = section
          return {
            type: section.blockType,
            title: title!,
            list: (testimonialsList ?? []).map(({ testimonial }) => {
              const { name, description, company } = testimonial as Testimonial
              return {
                name: name!,
                description: description!,
                company: company!,
              }
            }),
          }
      }
    }),
  }
}
