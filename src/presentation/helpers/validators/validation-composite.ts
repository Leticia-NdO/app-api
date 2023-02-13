import { Validation } from '../../protocols/validation'
import { ValidationResult } from '../../protocols/validation-result'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}

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
