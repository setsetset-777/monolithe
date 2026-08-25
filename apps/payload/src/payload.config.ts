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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isDev = process.env.NODE_ENV === 'development'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin: isDev
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
        req.payload.logger.info(req.query, 'Hiiting endpoint /general')
        const data = await fetchGeneral(req)
        req.payload.logger.info(data, `Fetched data for general`)

        return Response.json({
          ok: true,
          ...data,
        })
      },
    },
    {
      path: '/page',
      method: 'get',
      handler: async (req) => {
        req.payload.logger.info(req.query, 'Hiiting endpoint /page')
        const [path, search] = (req.query.path as string).split('?')
        let params = new URLSearchParams(search)
        const data = await fetchPage(req, path, params)
        req.payload.logger.info(data, `Fetched data for ${req.query.path}`)

        try {
          return Response.json({
            ok: true,
            ...data,
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
