import { Router } from 'express'
import type { Router as RouterType } from 'express'
import type { Request, Response, NextFunction } from 'express'

import payloader from '@packages/api'
import logger from '@packages/logger'

import { getLocales } from '../utils/locales'
import { plantsMap } from '../utils/plants'
import { encodeSlug } from '../utils'
import type { HttpError } from '../types/index'
import type { Locale } from '@packages/types'

type Route = {
  path: string
  slug: string
}

type Routes = { [key: string]: Route }

export const initRouter = async (): Promise<RouterType> => {
  const router = Router()

  router.get('/{*paths}', async (req, res, next) => {
    const paths = req.params.paths || []
    const url = req.url

    try {
      /* Handle locales */
      const { localeCodes: locales } = await getLocales()

      const locale = (locales.includes(paths[0]) && paths[0]) as Locale
      let path = url

      if (locale) {
        // Remove locale
        path = path.replace(new RegExp(`^${locale}(?=\/|$)`), '')
      }

      /* Handle routes */
      const generalResponse = await payloader.fetch({ slug: 'general', params: { locale } })

      const routes: Routes = generalResponse.routes
      const generalData = generalResponse.data
      const route = Object.values(routes).find((value) => value.path === path)

      const menu = generalData.navigation.navigationList.map((slug: string) => routes[slug])

      if (!route) {
        next(404)
        return
      }

      const slug = route?.slug
      if (!slug) {
        throw new Error(`No route found for path : ${path}`)
      }

      const pageData = await payloader.global(slug, { locale })

      res.render('main', {
        pageSlug: route.slug,
        generalData,
        menu,
        pageData,
        routes,
        plants: {
          map: plantsMap,
        },
        payloadUrl: process.env.PAYLOAD_URL,
        encodeSlug,
      })
    } catch (e) {
      logger.error('error', e)
      next(e)
    }
  })

  /**
   * ERROR HANDLING
   */
  router.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const templates: { [key: string]: string } = {
      404: 'errors/404',
      default: 'errors/500',
    }
    const template = templates[err as unknown as string | number] ?? templates.default

    res.render(template, {
      message:
        process.env.NODE_ENV === 'production'
          ? 'Something went wrong. Please try again later.'
          : err.message,
    })
  })

  return router
}
