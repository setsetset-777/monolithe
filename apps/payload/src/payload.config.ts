import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, CollectionSlug, GlobalSlug } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { MediaTags } from '@/collections/MediaTags'
import { Services } from '@/collections/Services'
import { Projects } from '@/collections/Projects'
import { Parutions } from '@/collections/Parutions'
import { Testimonials } from '@/collections/Testimonials'

import { General } from '@/globals/General'
import { PageHome } from '@/globals/PageHome'
import { PagePresentation } from '@/globals/PagePresentation'
import { PageServices } from '@/globals/PageServices'
import { PageProjects } from '@/globals/PageProjects'
import { PageContact } from '@/globals/PageContact'

import { localization, customTranslations } from '@/i18n'
import { getRoutes } from '@/helpers/routes'
import regenerateMedia from '@/helpers/regenerateMedia'
import { Locale } from '@/types'
import { getPageData } from './helpers/getPageData'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin:
      process.env.NODE_ENV === 'development'
        ? {
            email: process.env.ADMIN_EMAIL,
          }
        : false,
  },
  i18n: {
    supportedLanguages: { en, fr },
    translations: customTranslations,
  },
  localization,
  globals: [General, PageHome, PagePresentation, PageServices, PageProjects, PageContact],
  collections: [Users, Media, MediaTags, Services, Projects, Parutions, Testimonials],
  routes: {
    admin: '/',
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'types/payload.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
  endpoints: [
    {
      path: '/locales',
      method: 'get',
      handler: async (req) => {
        return Response.json(localization)
      },
    },
    {
      path: '/general',
      method: 'get',
      handler: async (req) => {
        const locale = (req.locale as Locale) ?? localization.defaultLocale
        const routes = await getRoutes(req.payload, locale)
        const services = (await req.payload.findGlobal({ slug: 'pageServices' })).list
        return Response.json({
          routes: routes,
          data: {
            ...(await req.payload.findGlobal({ slug: 'general' })),
            services,
          },
        })
      },
    },
    {
      path: '/page',
      method: 'get',
      handler: async (req) => {
        let path = req.query.path as string
        try {
          const pageData = await getPageData(path, req)
          return Response.json({
            ok: true,
            ...pageData,
          })
        } catch (e) {
          return Response.json(
            {
              ok: false,
              message: e instanceof Error ? e.message : String(e),
            },
            {
              status: 500,
            },
          )
        }
      },
    },
    {
      path: '/regenerate-media',
      method: 'post',
      handler: async (req) => {
        try {
          await regenerateMedia(req.payload, 'media')
          return Response.json({
            ok: true,
          })
        } catch (err) {
          return Response.json(
            {
              ok: false,
              message: err instanceof Error ? err.message : String(err),
            },
            {
              status: 500,
            },
          )
        }
      },
    },
  ],
})
