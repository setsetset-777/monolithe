import { GlobalSlug, CollectionSlug } from 'payload'
import { PageContact, PageHome, PagePresentation, ProjectsSelect, PageProject, PageService } from './payload'

export type PageSlug = Extract<
  GlobalSlug | CollectionSlug,
  'pageHome' | 'pagePresentation' | 'pageProjects' | 'projects' | 'pageContact' | 'pageServices'
  >

export type PageResponseData =  PageHome | PagePresentation | PageService | PageProject | ProjectsSelect | PageContact

export interface PageResponse {
  slug: PageSlug
  data: PageResponseData
}
