import {
  PageResponse,
  PageData,
  PageHome,
  Media,
  Route,
  PagePresentation,
  Parution,
  Testimonial,
  PresentationSection,
} from '@/types'
import { resolveRoute } from './routes'
import { CollectionSlug, DataFromGlobalSlug, GlobalSlug, PayloadRequest } from 'payload'

export const getPageData = async (path: string, req: PayloadRequest): Promise<PageResponse> => {
  const { locale, route, routes } = await resolveRoute(path, req)

  const pageData =
    route.type === 'collection'
      ? await req.payload.findByID({
          collection: route.slug as CollectionSlug,
          locale,
          id: route.id,
        })
      : await req.payload.findGlobal({
          slug: route.slug as GlobalSlug,
          locale,
        })

  return {
    slug: route.slug,
    data: formatPageData(pageData, route),
  }
}

function formatPageData<T extends GlobalSlug>(
  pageData: DataFromGlobalSlug<T>,
  route: Route,
): PageData {
  switch (route.slug) {
    case 'pageHome':
      const { presentation, services, projects } = pageData as PageHome

      return {
        presentation: {
          heroImage: presentation?.heroImage as Media,
          catch: presentation?.catch!,
          url: presentation?.link!,
          linkLabel: presentation?.linkLabel!,
        },
        services: {
          title: services?.title!,
          url: services?.link!,
          linkLabel: services?.linkLabel!,
          items: services?.items?.map((item) => ({
            title: item.title!,
            url: item.url!,
          }))!,
        },
        projects: {
          highlights: projects?.highlights?.map((item) => ({
            title: item.title!,
            url: item.link!,
            image: item.image as Media,
          }))!,
          linkLabel: projects?.linkLabel!,
          url: projects?.link!,
        },
      }

    case 'pagePresentation':
      const {
        title: heroTitle,
        heroImage,
        monolithePresentation,
        sections,
      } = pageData as PagePresentation

      return {
        hero: {
          title: heroTitle,
          image: heroImage as Media,
          slug: route.slug,
        },
        presentation: monolithePresentation!,
        sections: (sections ?? []).map((section): PresentationSection => {
          const { title } = section
          switch (section.blockType) {
            case 'textWithTitleBlock':
              const { text, image } = section
              return {
                title: title!,
                text: text!,
                image: image as Media,
              }
            case 'listBlock':
              const { values } = section
              return {
                title: title!,
                values: (values ?? []).map(({ title }) => ({
                  title: title!,
                })),
              }
            case 'parutionsBlock':
              const { parutionList } = section
              return {
                title: title!,
                list: (parutionList ?? []).map(({ parution }) => {
                  const { title, publisher, type, date, link, thumbnail } = parution as Parution
                  return {
                    title: title!,
                    publisher: publisher!,
                    type: type!,
                    date: date!,
                    link: link!,
                    thumbnail: thumbnail as Media,
                  }
                }),
              }
            case 'testimonialsBlock':
              const { testimonialsList } = section
              return {
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

    default:
      return null
  }
}
