import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'
import { ValidationResult } from '../../protocols/validation-result'

export class RequiredFieldValidation implements Validation {
  private readonly fieldName: string
  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

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