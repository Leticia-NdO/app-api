import { InvalidParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationResult } from './validation-result'

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldToCompareName: string

  constructor (fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName
    this.fieldToCompareName = fieldToCompareName
  }

  validate (input: any): ValidationResult {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return {
        isValid: false,
        error: new InvalidParamError(this.fieldToCompareName)
      }
    }

    return { isValid: true }
  }
}

// const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
// for (const field of requiredFields) {
//   if (!httpRequest.body[field]) {
//     return badRequest(new MissingParamError(field))
//   }
// }
