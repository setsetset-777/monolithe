import type { Testimonial, Hero, Parution, Media } from '../shared'

export namespace Presentation {
  export interface TextWithTitleSection {
    type: 'textWithTitleBlock'
    title: string
    text: string
    image?: Media
  }

  export interface ListSection {
    type: 'listBlock'
    title: string
    values: Array<{
      title: string
    }>
  }

  export interface ParutionsSection {
    type: 'parutionsBlock'
    title: string
    list: Array<Parution>
  }

  export interface TestimonialsSection {
    type: 'testimonialsBlock'
    title: string
    list: Array<Testimonial>
  }

  export type Section = TextWithTitleSection | ListSection | ParutionsSection | TestimonialsSection

  export interface Data {
    hero: Hero
    presentation?: string
    sections: Array<Section>
  }
}
