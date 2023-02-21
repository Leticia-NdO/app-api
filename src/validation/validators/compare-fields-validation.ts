import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'
import { ValidationResult } from '../protocols/validation-result'

export class CompareFieldsValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly fieldToCompareName: string) {}

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
