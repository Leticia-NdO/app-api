import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'
import { ValidationResult } from '../../protocols/validation-result'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): ValidationResult {
    if (!input[this.fieldName]) {
      return {
        isValid: false,
        error: new MissingParamError(this.fieldName)
      }
    }

    return { isValid: true }
  }
}
