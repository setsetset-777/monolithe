import type { Media } from '@monolithe/payload/types'
import type { Testimonial, Hero, Parution } from '../shared'

export namespace Presentation {
  export interface TextWithTitleBlock {
    title: string
    text: string
    image?: Media
  }

  export interface ListBlock {
    title: string
    values: Array<{
      title: string
    }>
  }

  export interface ParutionBlock {
    title: string
    list: Array<Parution>
  }

  export interface TestimonialBlock {
    title: string
    list: Array<Testimonial>
  }

  export type Section = TextWithTitleBlock | ListBlock | ParutionBlock | TestimonialBlock

  export interface Data {
    hero: Hero
    presentation?: string
    sections: Array<Section>
  }
}
