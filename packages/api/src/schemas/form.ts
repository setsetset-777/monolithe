import * as z from 'zod'

import locales from '../locales'

export const honeyName = 'abcde'

export const formSchema = z.object({
  name: z
    .string(locales.errors.invalid)
    .min(1, locales.errors.required)
    .max(100, locales.errors.tooLong),
  email: z.email(locales.errors.invalid).max(200, locales.errors.tooLong),
  phone: z.string(locales.errors.invalid).max(20, locales.errors.tooLong).optional(),
  message: z
    .string(locales.errors.invalid)
    .min(1, locales.errors.required)
    .max(10000, locales.errors.tooLong),
  [honeyName]: z.null(),
})

export type FormDataType = z.infer<typeof formSchema>
