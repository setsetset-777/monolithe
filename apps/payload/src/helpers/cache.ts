import { normalLocale } from '@/i18n'
import { Locale } from '@/types'
import * as API from '@monolithe/api/types'
import { revalidateTag } from 'next/cache'

const globalTags = {
  projectAll: () => 'project',
  home: () => 'home',
  presentation: () => 'presentation',
  services: () => `services`,
  projects: () => `projects`,
  contact: () => `contact`,
  general: () => `general`,
  projectList: () => `projectList`,
  routes: () => 'routes',
}

export const tags = {
  ...globalTags,
  project: (id: string) => `project:${id}`,
  projectLocale: (id: string, locale: Locale) => `project:${id}:${normalLocale(locale)}`,
  homeLocale: (locale: Locale) => `home:${normalLocale(locale)}`,
  presentationLocale: (locale: Locale) => `presentation:${normalLocale(locale)}`,
  servicesLocale: (locale: Locale) => `services:${normalLocale(locale)}`,
  projectsQueryLocale: (params: API.Projects.SearchParams, locale: Locale) =>
    `projects:${JSON.stringify(params)}:${normalLocale(locale)}`,
  contactLocale: (locale: Locale) => `contact:${normalLocale(locale)}`,
  generalLocale: (locale: Locale) => `general:${normalLocale(locale)}`,
  projectListQueryLocale: (params: API.Projects.SearchParams, locale: Locale) =>
    `projectList:${JSON.stringify(params)}:${normalLocale(locale)}`,
}

export const invalidateAll = () => {
  Object.values(globalTags).forEach((tag) => {
    revalidateTag(tag(), 'max')
  })
}
