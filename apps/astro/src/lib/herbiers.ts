import type { PageSlug } from '@monolithe/api/types'

const pagesPlantsOrder = [
  'pageHome',
  'pagePresentation',
  'pageServices',
  'pageProjects',
  'pageContact',
]

type HerbierType = 'left' | 'centre'

type Herbier = {
  slug: (typeof pagesPlantsOrder)[number]
  type: HerbierType
  index: number
}

type Herbiers = Array<Herbier>

export const getHerbier = (type: HerbierType): Herbiers => {
  return pagesPlantsOrder.map((slug, index) => {
    return {
      slug,
      type,
      index,
    }
  })
}

export const getPlantIndex = (slug: PageSlug) => {
  return pagesPlantsOrder.indexOf(slug)
}
