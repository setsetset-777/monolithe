import '../styles/index.scss'

import './components'

import { addEmails } from './scripts/mail'

/**
 * Run main code
 */
const init = () => {
  console.log('Init monolithe app')

  addEmails()
}

/**
 * Execute script on DOM ready
 */
document.addEventListener('DOMContentLoaded', init)
