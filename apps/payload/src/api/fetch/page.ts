import { resolveRoute } from '../../helpers/routes'
import type { PayloadRequest } from 'payload'
import type { PageFetch } from '@/types'

export const fetchPage = async (req: PayloadRequest, path: string): Promise<PageFetch> => {
  const {
    locale,
    route: { slug, id },
  } = await resolveRoute(path, req)

  switch (slug) {
    case 'projects':
      return {
        slug: 'projects',
        data: await req.payload.findByID({
          collection: slug,
          locale,
          id,
        }),
      }

    case 'pageHome':
      return {
        slug: 'pageHome',
        data: await req.payload.findGlobal({
          slug,
          locale,
        }),
      }

    case 'pagePresentation':
      return {
        slug: 'pagePresentation',
        data: await req.payload.findGlobal({
          slug,
          locale,
        }),
      }

    case 'pageServices':
      return {
        slug: 'pageServices',
        data: await req.payload.findGlobal({
          slug,
          locale,
          depth: 2,
        }),
      }

    case 'pageProjects':
      return {
        slug: 'pageProjects',
        data: await req.payload.findGlobal({
          slug,
          locale,
        }),
      }

    case 'pageContact':
      return {
        slug: 'pageContact',
        data: await req.payload.findGlobal({
          slug,
          locale,
        }),
      }
  }
}
