import type { Hero, Media } from '../shared'

export namespace Services {
  export interface Section {
    title: string
    url: string
    linkLabel?: string
    slug: string
    projectsUrl: string
    text: string
  }

  export interface SingleLevelSection extends Section {
    type: 'singleLevel'
    image?: Media
  }

  export interface MultiLevelSection extends Section {
    type: 'multiLevel'
    subsections: Array<MultiLevelSubsection>
  }

  export interface MultiLevelSubsection {
    title: string
    image?: Media
    text: string
  }

  export interface Data {
    hero: Hero
    sections: Array<SingleLevelSection | MultiLevelSection | undefined>
  }
}
