import type { LocalizedRoutes, General, PageService } from '@/types'

export interface GeneralResponse {
  general: General
  services: PageService
  routes: LocalizedRoutes
}
