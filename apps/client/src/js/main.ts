import '../styles/index.scss'

import './components'

import { addEmails } from './scripts/mail'
import { init as initScroll } from './scripts/scroll'
import { init as initMenu } from './scripts/menu'
import { init as initSlider } from './scripts/slider'

/**
 * Run main code
 */
const init = () => {
  console.log('Init monolithe app')

  addEmails()
  initScroll()
  initMenu()
  initSlider()
}

/**
 * Execute script on DOM ready
 */
document.addEventListener('DOMContentLoaded', init)
