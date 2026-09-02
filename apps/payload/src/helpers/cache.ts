import { normalLocale } from '@/i18n'
import { Locale } from '@/types'
import * as API from '@monolithe/api/types'

export const tags = {
  project: (id: string) => `project:${id}`,
  projectLocale: (id: string, locale: Locale) => `project:${id}:${normalLocale(locale)}`,
  home: () => `home`,
  homeLocale: (locale: Locale) => `home:${normalLocale(locale)}`,
  presentation: () => `presentation`,
  presentationLocale: (locale: Locale) => `presentation:${normalLocale(locale)}`,
  services: () => `services`,
  servicesLocale: (locale: Locale) => `services:${normalLocale(locale)}`,
  projects: () => `projects`,
  projectsQueryLocale: (params: API.Projects.SearchParams, locale: Locale) =>
    `projects:${JSON.stringify(params)}:${normalLocale(locale)}`,
  contact: () => `contact`,
  contactLocale: (locale: Locale) => `contact:${normalLocale(locale)}`,
  general: () => `general`,
  generalLocale: (locale: Locale) => `general:${normalLocale(locale)}`,
  projectList: () => `projectList`,
  projectListQueryLocale: (params: API.Projects.SearchParams, locale: Locale) =>
    `projectList:${JSON.stringify(params)}:${normalLocale(locale)}`,
}
