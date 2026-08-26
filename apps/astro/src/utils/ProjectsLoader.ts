export default class ProjectsLoader {
  element: Element
  listElement: Element | null
  loaderElement: Element | null
  activeServices: string[] = []
  page: number | null = null
  limit: number | null = null
  searchParams: URLSearchParams
  html: string | null = null
  controller: AbortController | null = null

  constructor({ elementSelector }: { elementSelector: string }) {
    const el = document.querySelector(elementSelector)

    if (!el) {
      throw new Error('ProjectsLoader: Element not found')
    }

    this.element = el

    this.listElement = this.element.querySelector('[data-projects-loader-list]')
    this.loaderElement = this.element.querySelector('[data-projects-loader-loader]')
    this.searchParams = new URLSearchParams()
  }

  async fetch(services?: string[]) {
    if (services) {
      this.activeServices = services
    }
    this.controller?.abort()
    this.controller = new AbortController()

    const params = new URLSearchParams()

    if (typeof this.page === 'number') {
      params.set('page', String(this.page))
    }

    if (typeof this.limit === 'number') {
      params.set('limit', String(this.limit))
    }

    params.delete('service')
    this.activeServices.forEach((item) => params.append('service', item))

    this.searchParams = params

    let response: Response

    try {
      response = await fetch(`/q/projects?${this.searchParams?.toString()}`, {
        signal: this.controller.signal,
      })

      if (!response.ok) {
        throw new Error('ProjectsLoader: Failed to load projects')
      }

      if (this.listElement) {
        this.listElement.innerHTML = await response.text()
      }

      this.onChange()
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return null
      throw err
    }
  }

  onChange() {
    const url = new URL(window.location.href)
    url.search = this.searchParams.toString()
    window.history.pushState({ url: url.toString() }, '', url.toString())
  }
}
