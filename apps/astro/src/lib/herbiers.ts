import HerbierLeft1 from '@/assets/svgs/plants/herbier-left-1.svg'
import HerbierLeft2 from '@/assets/svgs/plants/herbier-left-2.svg'
import HerbierLeft3 from '@/assets/svgs/plants/herbier-left-3.svg'
import HerbierLeft4 from '@/assets/svgs/plants/herbier-left-4.svg'
import HerbierLeft5 from '@/assets/svgs/plants/herbier-left-5.svg'

import HerbierCentre1 from '@/assets/svgs/plants/herbier-centre-1.svg'
import HerbierCentre2 from '@/assets/svgs/plants/herbier-centre-2.svg'
import HerbierCentre3 from '@/assets/svgs/plants/herbier-centre-3.svg'
import HerbierCentre4 from '@/assets/svgs/plants/herbier-centre-4.svg'
import HerbierCentre5 from '@/assets/svgs/plants/herbier-centre-5.svg'

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
  plant: Plant
}

type Herbiers = Array<Herbier>

const herbiers: Record<HerbierType, Array<SvgComponent>> = {
  left: [HerbierLeft1, HerbierLeft2, HerbierLeft3, HerbierLeft4, HerbierLeft5],
  centre: [HerbierCentre1, HerbierCentre2, HerbierCentre3, HerbierCentre4, HerbierCentre5],
}

export const getHerbier = (type: HerbierType): Herbiers => {
  return pagesPlantsOrder.map((slug, index) => {
    return {
      slug,
      plant: herbiers[type][index],
    }
  })
}

export const getPlant = (slug: PageSlug, type: HerbierType = 'left') => {
  const herbier = getHerbier(type)
  const index = pagesPlantsOrder.indexOf(slug)
  return herbier[index]
}
