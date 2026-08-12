import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
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
import regenerateMedia from '@/helpers/regenerateMedia'

import { fetchGeneral } from '@/api/fetch/general'
import { fetchPage } from '@/api/fetch/page'
import {
  transformContactData,
  transformGeneralData,
  transformHomeData,
  transformPresentationData,
  transformProjectData,
  transformProjectsData,
  transformServicesData,
} from '@/api/transform'

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
      path: '/general',
      method: 'get',
      handler: async (req) => {
        const data = await fetchGeneral(req)
        const response = transformGeneralData(data)

        return Response.json({
          ok: true,
          ...response,
        })
      },
    },
    {
      path: '/page',
      method: 'get',
      handler: async (req) => {
        let path = req.query.path as string

        try {
          const { slug, data } = await fetchPage(req, path)
          let response

          switch (slug) {
            case 'pageHome':
              response = {
                data: transformHomeData(data),
                slug: 'pageHome',
              }
              break
            case 'pagePresentation':
              response = {
                data: transformPresentationData(data, slug),
                slug,
              }
              break
            case 'pageServices':
              response = {
                data: transformServicesData(data, slug),
                slug,
              }
              break
            case 'pageProjects':
              response = {
                data: transformProjectsData(data, slug),
                slug,
              }
              break
            case 'projects':
              response = {
                data: transformProjectData(data, slug),
                slug,
              }
              break
            case 'pageContact':
              response = {
                data: transformContactData(data, slug),
                slug,
              }
              break
          }

          return Response.json({
            ok: true,
            ...response,
          })
        } catch (e) {
          console.error(`Error retrieving page for ${path}`, e)
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
