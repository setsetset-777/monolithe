import { GlobalSlug, CollectionSlug } from 'payload'
import type * as API from '@monolithe/api/types'
import {
  PageContact,
  PageHome,
  PagePresentation,
  PageProject,
  PageService,
  Project,
} from './payload'

export type PageSlug = Extract<
  GlobalSlug | CollectionSlug,
  | 'pageHome'
  | 'pagePresentation'
  | 'pageProjects'
  | 'projects'
  | 'pageContact'
  | 'pageServices'
  | 'services'
>

export type PageFetch =
  | {
      data: PageHome
      slug: 'pageHome'
    }
  | {
      data: PagePresentation
      slug: 'pagePresentation'
    }
  | {
      data: PageService
      slug: 'pageServices'
    }
  | {
      data: PageProject
      slug: 'pageProjects'
    }
  | {
      data: Project
      slug: 'projects'
    }
  | {
      data: PageContact
      slug: 'pageContact'
    }

export type PageResponse =
  | {
      data: API.Home.Data
      slug: 'pageHome'
    }
  | {
      data: API.Presentation.Data
      slug: 'pagePresentation'
    }
  | {
      data: API.Services.Data
      slug: 'pageServices'
    }
  | {
      data: API.Projects.Data
      slug: 'pageProjects'
    }
  | {
      data: API.Project.Data
      slug: 'projects'
    }
  | {
      data: API.Contact.Data
      slug: 'pageContact'
    }
