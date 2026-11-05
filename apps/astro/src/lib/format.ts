import locales from '@monolithe/api/locales'
import type { Form } from '@monolithe/api/types'

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export const textToHtml = (str: string): string => {
  return escapeHtml(str.replace(/\r\n?/g, '\n')).replace(/\n/g, '<br>')
}

export const formEmailHtml = ({ name, email, phone, message }: Form.Data) => {
  const phoneBlock = phone
    ? `<p>
<b>${locales.form.phone} :</b> ${phone}
</p>`
    : ''
  return `<p>${locales.form.greetings},</p>
<p>${locales.form.body}</p>

<p>
<b>${locales.form.name} :</b> ${name}
</p>

<p>
<b>${locales.form.email} :</b> ${email}
</p>

${phoneBlock}
<p>
<b>${locales.form.message} : </b>
<br /><br />
${textToHtml(message)}
</p>`
}

export const formEmailText = ({ name, email, phone, message }: Form.Data) => {
  const phoneBlock = phone ? `${locales.form.phone} : ${phone}\n\n` : ''
  return `${locales.form.greetings}, \n\n
${locales.form.body}\n\n
${locales.form.name} : ${name}\n\n
${locales.form.email} : ${email}\n\n
${phoneBlock}
${locales.form.message} : \n\n
${message}`
}
