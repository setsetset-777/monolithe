import nodemailer from 'nodemailer'
import logger from '@monolithe/logger'
import * as z from 'zod'

let credentials = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_HOST ?? 587,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_KEY,
}

const isTestAccount = process.env.NODE_ENV !== 'production'

export const honeyName = 'abcde'

if (isTestAccount) {
  const {
    smtp: { host, port },
    user,
    pass,
  } = await nodemailer.createTestAccount()
  credentials = { host, port, user, pass }
}

export const errorMessages = {
  required: 'Ce champ est obligatoire.',
  email: 'Cet email est invalide.',
  check: 'Vérifiez vos informations.',
  general: "Une erreur est survenue. Merci d'essayer plus tard.",
  tooLong: 'Le champs entré est trop long',
}

export const schema = z.object({
  name: z.string().min(1, errorMessages.required).max(100, errorMessages.tooLong),
  email: z.email(errorMessages.email).max(200, errorMessages.tooLong),
  phone: z.string().max(20, errorMessages.tooLong).optional(),
  message: z.string().min(1, errorMessages.required).max(10000, errorMessages.tooLong),
})

export type Data = z.infer<typeof schema>

export const formatMailHtml = ({ name, email, phone, message }: z.infer<typeof schema>) => {
  const phoneBlock = phone
    ? `<p>
    <b>Téléphone :</b> ${phone}
    </p>`
    : ''
  return `<p>Chère Monolithe,</p>
    <p>Quelqu'un vous a contacté via le formulaire de votre site. Vous pouvez envoyer un message directement en répondant à cet email.</p>

    <p>
    <b>Nom :</b> ${name}
    </p>

    <p>
    <b>Email :</b> ${email}
    </p>

    ${phoneBlock}
<p>
<b>Message : </b>
<br /><br />
${textToHtml(message)}
</p>
`
}

export const formatMailText = ({ name, email, phone, message }: z.infer<typeof schema>) => {
  const phoneBlock = phone ? `Téléphone : ${phone}\n\n` : ''
  return `Chère Monolithe, \n\n
Quelqu'un vous a contacté via le formulaire de votre site. Vous pouvez envoyer un message directement en répondant à cet email.\n\n
Nom : ${name}\n\n
Email : ${email}\n\n
${phoneBlock}
Message : \n\n
${message}`
}

const { host, port, user, pass } = credentials
const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: { user, pass },
  connectionTimeout: 10000,
  socketTimeout: 20000,
  greetingTimeout: 10000,
})

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

export const mail = async ({
  from,
  to,
  subject,
  text,
  html,
}: {
  from: string
  to?: string
  subject: string
  text?: string
  html?: string
}) => {
  if (!to) {
    throw new Error('No destination email provided')
  }

  try {
    const params = {
      from: `"Monolithe." <${process.env.FROM_EMAIL}>`,
      replyTo: from,
      to: escapeHtml(to),
      subject: subject.replace(/[\r\n]+/g, ' ').slice(0, 150),
      text,
      html,
    }

    const info = await transporter.sendMail(params)

    logger.info(`Email sent: ${JSON.stringify(params)}`)

    if (isTestAccount) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    }
  } catch (e) {
    throw e
  }
}
