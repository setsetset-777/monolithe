import type { Form } from '@monolithe/api/types'
import { mail } from '@/lib/mail'
import { formEmailHtml, formEmailText } from './format'

export const sendForm = async (input: Form.Data, to: string) => {
  const params = {
    from: input.email,
    subject: 'Monolithe – Formulaire  de contact',
    to,
    html: formEmailHtml(input),
    text: formEmailText(input),
  }

  await mail(params)
}

// let errorMessage, success, data
//
// let errors: Record<string, string> = {}
//
// if (Astro.request.method === 'POST') {
//   if (!hit(`ip:${Astro.clientAddress}`, 3, 10 * 60_000) || !hit('global', 50, 60 * 60_000)) {
//     return new Response('Too many requests', { status: 429 })
//   }
//
//   try {
//     const formData = await Astro.request.formData()
//
//     const honey = formData.get(honeyName)
//
//     if (!(honey === null || honey === '' || typeof honey === 'undefined')) {
//       throw new Error(errorMessages.general)
//     }
//
//     data = Object.fromEntries(formData)
//     data = schema.parse(data)
//
//     const params = {
//       from: data.email,
//       subject: 'Monolithe – Formulaire  de contact',
//       to: form.email,
//       html: formatMailHtml(data),
//       text: formatMailText(data),
//     }
//
//     await mail(params)
//
//     success = true
//   } catch (error) {
//     if (error instanceof ZodError) {
//       errorMessage = errorMessages.check
//       errors = error.flatten((issue) => issue.message).fieldErrors
//     } else if (error instanceof Error) {
//       console.error(error.message)
//       errorMessage = errorMessages.general
//     }
//   }
// }
