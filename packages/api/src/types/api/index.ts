// TODO: Move data types and transformations to api package
// TODO: Use namespaces for pages (General, Presentation, etc.)

export * from '../shared'
export * from './general'
export * from './home'
export * from './presentation'
export * from './services'
export * from './projects'
export * from './project'
export * from './contact'

import type { Home } from './home'
import type { Presentation } from './presentation'
import type { Services } from './services'
import type { Projects } from './projects'
import type { Project } from './project'
import type { Contact } from './contact'

export type PageData =
  Home.Data | Presentation.Data | Services.Data | Projects.Data | Project.Data | Contact.Data

export type FetchData = Promise<Record<string, any>>

export interface InitConfig {
  enable: boolean
  apiUrl: string
  serviceUser: string
  servicePassord: string
  env: 'production' | 'development'
}
