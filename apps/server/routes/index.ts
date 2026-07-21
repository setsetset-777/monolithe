import { Router } from 'express'
import type { Router as RouterType } from 'express'
import type { Request, Response, NextFunction } from 'express'

import payloader from '@packages/api'
import logger from '@packages/logger'

import { getAssetsDetails, clientDistPath } from '../utils/index.ts'
import { getLocales } from '../utils/locales.ts'
import type { HttpError, Locale } from '../types/index.ts'

type Route = {
  path: string
  slug: string
}

type Routes = { [key: string]: Route }

export const initRouter = async (): Promise<RouterType> => {
  const router = Router()

  const { mainJs, mainCss, resetCss } = getAssetsDetails(clientDistPath)
  const viewData = {
    mainJs,
    mainCss,
    resetCss,
    analytics: {
      enable: process.env.ANALYTICS_ENABLE === 'true',
      domain: process.env.ANALYTICS_DOMAIN,
      id: process.env.ANALYTICS_ID,
    },
  }

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
      console.log('generalResponse', 'init')
      const generalResponse = await payloader.fetch('general', null, locale as string)

      console.log('generalResponse', generalResponse)
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

      const pageData = await payloader.global(slug, locale)

      res.render('main', {
        ...viewData,
        pageSlug: route.slug,
        generalData,
        menu,
        pageData,
        routes,
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
      ...viewData,
    })
  })

  return router
}
