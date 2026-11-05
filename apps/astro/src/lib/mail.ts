import nodemailer from 'nodemailer'
import logger from '@monolithe/logger'

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
