import type { FormDataType } from '../../schemas'

export namespace Form {
  export interface Response {
    email: string
    message: string
  }

  export type Data = FormDataType
}
