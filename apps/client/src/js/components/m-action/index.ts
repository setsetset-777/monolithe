import styles from './styles.scss?inline'
import { resetSheet } from '../../shared/component-reset'

const sheet = new CSSStyleSheet()
sheet.replaceSync(styles)

class MAction extends HTMLElement {
  static observedAttributes = ['href']

  readonly shadow = this.attachShadow({ mode: 'open' })

  private anchor: HTMLAnchorElement

  constructor() {
    super()

    this.shadow.adoptedStyleSheets = [resetSheet, sheet]

    this.shadow.innerHTML = `
        <a part="root">
          <slot></slot>
        </a>
      `

    this.anchor = this.shadow.querySelector('a')!
  }

  connectCallback() {
    this.sync()
  }

  attributeChangedCallback() {
    this.sync()
  }

  private sync() {
    this.anchor.href = this.getAttribute('href') ?? '#'
  }
}

customElements.define('m-action', MAction)
