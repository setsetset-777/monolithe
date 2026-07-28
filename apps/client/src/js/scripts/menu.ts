export const init = () => {
  const items = document.querySelectorAll('nav.sidebar-menu a')
  const plants = document.querySelector('.sidebar-plants') as HTMLElement

  items.forEach((item) => {
    if (!(item instanceof HTMLElement)) return

    const slug = item.dataset.slug

    item.addEventListener('mouseover', () => {
      plants.dataset.active = slug
    })

    item.addEventListener('mouseout', () => {
      plants.removeAttribute('data-active')
    })
  })
}
