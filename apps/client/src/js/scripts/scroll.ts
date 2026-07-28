export const init = () => {
  const anchors = document.querySelectorAll('[data-scroll]')
  anchors.forEach((anchor) => {
    if (!(anchor instanceof HTMLElement)) {
      return
    }
    const selector = anchor.dataset.scroll!
    const target = document.querySelector(selector)
    anchor.addEventListener('click', () => {
      target!.scrollIntoView()
    })
  })
}
