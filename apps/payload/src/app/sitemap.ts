import { getPayload, type BasePayload } from 'payload'
import config from '@payload-config'
import { getRoutes } from '@/helpers/routes'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload: BasePayload = await getPayload({ config })
  const url = process.env.MEDIA_URL
  const routes = await getRoutes(payload)
  return Object.values(routes).map(({ path, updatedAt }) => ({
    url: `${url}${path}`,
    lastModified: updatedAt ? new Date(updatedAt) : undefined,
  }))
}
