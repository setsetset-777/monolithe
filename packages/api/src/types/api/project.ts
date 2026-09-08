import { Media } from '../shared'

export namespace Project {
  export interface GalleryItem {
    image: Media
    fullwidth?: boolean
    text?: string
  }

  export type Gallery = Array<GalleryItem>

  export interface Data {
    hero: {
      image: Media
      title: string
      backLink: string
      backLinkLabel?: string
      text?: string
    }
    gallery: Gallery
  }
}
