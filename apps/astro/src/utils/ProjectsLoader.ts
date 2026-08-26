export default class ProjectsLoader {
  element: HTMLElement
  listElement: HTMLElement | null
  activeServices: string[] = []
  page: number | null = null
  limit: number | null = null
  searchParams: URLSearchParams
  html: string | null = null
  controller: AbortController | null = null
  timeout: NodeJS.Timeout | null = null

  constructor({ elementSelector }: { elementSelector: string }) {
    const el = document.querySelector<HTMLElement>(elementSelector)

    if (!el) {
      throw new Error('ProjectsLoader: Element not found')
    }

    this.element = el

    this.listElement = this.element.querySelector('[data-projects-loader-list]')
    this.searchParams = new URLSearchParams()
  }

  prepareParams() {
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
  }

  load() {
    this.element.setAttribute('aria-busy', 'true')
    this.element.dataset.state = 'loading'
  }

  unload() {
    this.element.setAttribute('aria-busy', 'true')
    this.element.dataset.state = 'loaded'
  }

  async fetch(services?: string[]) {
    if (services) {
      this.activeServices = services
    }
    this.controller?.abort()
    this.controller = new AbortController()

    this.prepareParams()

    let response: Response

    this.timeout = setTimeout(() => {
      this.load()
    }, 150)

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
    } finally {
      clearTimeout(this.timeout)
      this.unload()
    }
  }

  onChange() {
    const url = new URL(window.location.href)
    url.search = this.searchParams.toString()
    window.history.pushState({ url: url.toString() }, '', url.toString())
  }
}
