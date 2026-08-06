import { Router } from 'express'
import type { Router as RouterType } from 'express'
import type { Request, Response, NextFunction } from 'express'

import { api } from '@monolithe/api'
import logger from '@monolithe/logger'

import { plantsMap } from '../utils/plants'
import { encodeSlug } from '../utils'
import type { HttpError } from '../types/index'

export const initRouter = async (): Promise<RouterType> => {
  const router = Router()

  router.get('/{*paths}', async (req, res, next) => {
    const paths = req.params.paths || []
    const url = req.url

    try {
      /* Handle locales */
      const page = await api.fetchPage(url)

      if (!page) {
        next(404)
        return
      }

      const { data, general, routes, slug } = page

      const menu = general.navigation.navigationList.map((slug: string) => routes[slug])

      res.render('main', {
        slug,
        general,
        menu,
        page: data,
        routes,
        plants: {
          map: plantsMap,
        },
        payloadUrl: process.env.MEDIA_URL,
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
