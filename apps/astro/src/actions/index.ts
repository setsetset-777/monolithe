import { ActionError, defineAction } from 'astro:actions'
import { formSchema, honeyName } from '@monolithe/api/schemas'
import locales from '@monolithe/api/locales'
import { sendForm } from '@/lib/form'

export const server = {
  form: defineAction({
    accept: 'form',
    input: formSchema,
    handler: async (input, context) => {
      // TODO check if clientAddress isn't from the proxy and include all users in the same bucket
      // if (!hit(`ip:${context.clientAddress}`, 3, 10 * 60_000) || !hit('global', 50, 60 * 60_000)) {
      //   throw new ActionError({
      //     code: 'TOO_MANY_REQUESTS',
      //     message: locales.errors.general,
      //   })
      // }

      // Honeypot filled: pretend success, send nothing
      if (input[honeyName]) return { sent: true }

      try {
        await sendForm(input)
      } catch (e) {
        console.error(e)
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: locales.errors.general,
        })
      }

      return { sent: true }
    },
  }),
}
