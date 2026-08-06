export const init = (selectorMneu: string, selectorItems: string) => {
  const plants = document.querySelector(selectorMneu) as HTMLElement

  if (!plants) return

  const items = document.querySelectorAll(selectorItems)
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
