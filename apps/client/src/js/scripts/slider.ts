const activeClass = 'active'
const duration = 3000

export const init = () => {
  const slider = document.querySelector('[data-slider]') as HTMLElement

  if (!slider) {
    return
  }

  const slides = slider?.querySelectorAll('[data-slider-item]')
  const remoteButtons = slider?.querySelectorAll('[data-slider-remote] button')

  if (slides.length <= 0 || remoteButtons.length <= 0) {
    console.log('No slides or buttons found for slide.')
  }

  let current = 0
  let timeout: number

  const activateSlide = (index: number) => {
    resetActiveSlides()

    if (!slides[index] || !remoteButtons[index]) {
      return
    }

    slides.forEach((slide) => slide.classList.remove(activeClass))
    remoteButtons.forEach((slide) => slide.classList.remove(activeClass))

    slides[index].classList.add(activeClass)
    remoteButtons[index].classList.add(activeClass)

    current = index
    start()
  }

  const resetActiveSlides = () => {
    slides.forEach((slide) => slide.classList.remove(activeClass))
    remoteButtons.forEach((slide) => slide.classList.remove(activeClass))
  }

  const start = () => {
    stop()

    timeout = setTimeout(() => {
      current++
      if (current >= slides.length) {
        current = 0
      }
      activateSlide(current)
    }, duration)
  }

  const stop = () => {
    clearTimeout(timeout)
  }

  slides.forEach((slide) => {
    slide.addEventListener('mouseenter', stop)
    slide.addEventListener('mouseleave', start)
  })

  remoteButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      activateSlide(index)
    })
  })

  setTimeout(() => {
    slider.dataset.slider = 'ready'
    activateSlide(current)
  }, 0)
}
