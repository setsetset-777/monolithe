import { ProjectsSearchParams, ServicesList } from '@monolithe/api/schemas'
import { Projects } from '@monolithe/api/types'
import listPublishedCollection from './listPublishedCollection'
import type { Locale } from '@/types'
import type { BasePayload } from 'payload'

export default async function safeProjectsParams(
  params: {
    service?: string[]
    page?: string
    limit?: string
  },
  payload: BasePayload,
  locale?: Locale,
): Promise<Projects.SearchParams> {
  try {
    // Parse all parameters
    const safeParams = ProjectsSearchParams.parse(params)

    // Confirm all services passed exists
    const services = await listPublishedCollection({
      slug: 'services',
      payload,
      locale,
    })

    ServicesList(services.docs.map(({ urlSlug }) => urlSlug)).parse(params.service ?? undefined)

    return safeParams
  } catch (e) {
    payload.logger.error(e)
    throw new Error('Unvalid search params')
  }
}
