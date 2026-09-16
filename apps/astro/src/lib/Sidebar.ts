export default class Sidebar {
  menuItemSelector = '[data-menu-item]'
  sidebarSelector = '[data-sidebar]'
  switchSelector = '[data-sidebar-switch]'
  plantsSelector = '[data-plants]'
  activeItemClass = 'active'
  body: HTMLBodyElement | null = null
  element: HTMLElement | null = null
  items: HTMLElement[] = []
  scrollPosition: number = 0
  #isOpened = false
  scrollTicking = false
  scrollDirection: 'north' | 'south' | null = null
  scrollDistance = 0
  scrollHeroTreshold = 0
  scrollTreshold = 25

  constructor() {}

  public initOnce() {
    this.initOnLoad()

    this.initMobile()
    this.initPlants()
    this.initScroll()
  }

  public initOnLoad() {
    this.body = document.querySelector('body')
    this.element = document.querySelector<HTMLElement>(this.sidebarSelector)
    this.items = Array.from(document.querySelectorAll<HTMLElement>(this.menuItemSelector))

    if (!this.element) {
      throw new Error('Sidebar: no element found')
    }

    this.initSize()
    this.initMenuState()
  }

  private initSize() {
    if (!this.body) return

    const slug = this.body.dataset.slug

    if (!slug) return
    this.body.dataset.sidebarSize = slug === 'pageHome' ? 'big' : 'small'
  }

  private initMenuState() {
    if (!this.body || !this.element) return

    const menuSlug = this.body.dataset.menuSlug

    if (!menuSlug) return

    this.items.forEach((item) => {
      item.dataset.slug === menuSlug
        ? item.classList.add(this.activeItemClass)
        : item.classList.remove(this.activeItemClass)
    })
  }

  private initMobile() {
    if (!this.element) return

    const button = document.querySelector<HTMLButtonElement>(this.switchSelector)

    if (!button) return
    button.addEventListener('click', () => {
      this.toggleSidebar()
    })
  }

  private initPlants() {
    const plants = document.querySelector<HTMLElement>(this.plantsSelector)

    if (!plants) return

    this.items.forEach((item) => {
      const slug = item.dataset.slug

      item.addEventListener('mouseover', () => {
        plants.dataset.active = slug
      })

      item.addEventListener('mouseout', () => {
        plants.removeAttribute('data-active')
      })
    })
  }

  initScroll() {
    this.scrollHeroTreshold = this.body?.querySelector('.hero')?.getBoundingClientRect().bottom ?? 0

    document.addEventListener('scroll', () => {
      if (!this.scrollTicking) {
        requestAnimationFrame(() => {
          this.updateScroll()
          this.scrollTicking = false
        })

        this.scrollTicking = true
      }
    })
  }

  updateScroll() {
    if (!this.element || this.isOpened) {
      return
    }
    const position = window.scrollY || document.documentElement.scrollTop

    if (position < this.scrollHeroTreshold) {
      this.element.dataset.slideOut = 'false'
      this.scrollDistance = 0
      return
    }

    const delta = position - this.scrollPosition

    if (Math.abs(delta) > 1) {
      const direction = delta > 0 ? 'south' : 'north'

      if (direction !== this.scrollDirection) {
        this.scrollDistance = 0
        this.scrollDirection = direction
      }

      this.scrollDistance += Math.abs(delta)

      if (this.scrollDistance >= this.scrollTreshold) {
        this.element.dataset.slideOut = direction === 'south' ? 'true' : 'false'
        this.scrollDistance = 0
      }

      this.scrollPosition = position
    }
  }

  private toggleSidebar(state?: boolean) {
    if (!this.element) return

    let nextState: boolean

    if (typeof state !== 'undefined') {
      nextState = state
    } else {
      nextState = this.element.dataset.open === 'false'
    }

    this.isOpened = nextState
  }

  public close() {
    this.isOpened = false
  }

  private set isOpened(value: boolean) {
    this.#isOpened = value
    if (this.element) {
      this.element.dataset.open = value ? 'true' : 'false'
    }
  }

  private get isOpened(): boolean {
    return this.#isOpened
  }
}
