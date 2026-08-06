export type * from '@monolithe/payload/types'

export type FetchData = Promise<Record<string, any>>

export interface APIInitConfig {
  enable: boolean
  apiUrl: string
  serviceUser: string
  servicePassord: string
  env: 'production' | 'development'
}
