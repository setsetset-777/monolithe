import '../styles/index.scss'

import './components'

import { addEmails } from './scripts/mail'
import { init as initScroll } from './scripts/scroll'

/**
 * Run main code
 */
const init = () => {
  console.log('Init monolithe app')

  addEmails()
  initScroll()
}

/**
 * Execute script on DOM ready
 */
document.addEventListener('DOMContentLoaded', init)
