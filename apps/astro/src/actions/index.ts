import { ActionError, defineAction } from 'astro:actions'
import { formSchema, honeyName } from '@monolithe/api/schemas'
import locales from '@monolithe/api/locales'
import { sendForm } from '@/lib/form'
import api from '@monolithe/api'

export const server = {
  form: defineAction({
    accept: 'form',
    input: formSchema,
    handler: async (input) => {
      // TODO check if clientAddress isn't from the proxy and include all users in the same bucket
      // if (!hit(`ip:${context.clientAddress}`, 3, 10 * 60_000) || !hit('global', 50, 60 * 60_000)) {
      //   throw new ActionError({
      //     code: 'TOO_MANY_REQUESTS',
      //     message: locales.errors.general,
      //   })
      // }

      let message = 'Sent!'

      // Honeypot filled: pretend success, send nothing
      if (input[honeyName]) return { sent: true, message }

      try {
        const response = await api.form()

        if (!response) {
          throw new Error("Couldn't retrieve form data")
        }

        message = response.message

        await sendForm(input, response.email)
      } catch (e) {
        console.error(e)
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: locales.errors.general,
        })
      }

      return { sent: true, message }
    },
  }),
}
