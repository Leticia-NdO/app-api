import { Validation } from './validation'
import { ValidationResult } from './validation-result'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

  validate (input: any): ValidationResult {
    for (const validation of this.validations) {
      const result = validation.validate(input)
      if (result.error) {
        return result
      }
    }

    return { isValid: true }
  }
}
