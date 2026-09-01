import Plant from '@/components/Plant.astro'

import type { SvgComponent } from 'astro/types'
import type { PageSlug } from '@monolithe/api/types'

const pagesPlantsOrder = [
  'pageHome',
  'pagePresentation',
  'pageServices',
  'pageProjects',
  'pageContact',
]

type Plant = SvgComponent

type HerbierType = 'left' | 'centre'

type Herbier = {
  slug: (typeof pagesPlantsOrder)[number]
  type: HerbierType
  index: number
}

type Herbiers = Array<Herbier>

// const herbiers: Record<HerbierType, Array<SvgComponent>> = {
//   left: [HerbierLeft1, HerbierLeft2, HerbierLeft3, HerbierLeft4, HerbierLeft5],
//   centre: [HerbierCentre1, HerbierCentre2, HerbierCentre3, HerbierCentre4, HerbierCentre5],
// }

export const getHerbier = (type: HerbierType): Herbiers => {
  return pagesPlantsOrder.map((slug, index) => {
    return {
      slug,
      type,
      index,
    }
  })
}

export const getPlantIndex = (slug: PageSlug, type: HerbierType = 'left') => {
  return pagesPlantsOrder.indexOf(slug)
}
