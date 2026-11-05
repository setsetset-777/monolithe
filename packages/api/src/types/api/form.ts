import type { FormDataType } from '../../schemas'

export namespace Form {
  export interface Response {
    email: string
  }

  export type Data = FormDataType
}
