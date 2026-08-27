// Encode with `btoa("me@email.com")`
export const addEmails = (encodedEmails: string[]) => {
  console.log('init addEmails')
  for (const [id, encodedEmail] of Object.entries(encodedEmails)) {
    const target = document.querySelector(`[data-email="${id}"]`)
    if (target) {
      const email = atob(encodedEmail)
      target.addEventListener('click', (e) => {
        e.preventDefault()
        window.location.href = `mailto:${email}`
      })
    }
  }
}
