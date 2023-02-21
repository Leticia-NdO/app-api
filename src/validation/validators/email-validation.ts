import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { Validation } from '../../presentation/protocols'
import { ValidationResult } from '../protocols/validation-result'

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}

  validate (input: any): ValidationResult {
    const isValid = this.emailValidator.isValid(input[this.fieldName])

    if (!isValid) {
      return {
        isValid: false,
        error: new InvalidParamError(this.fieldName)
      }
    }

    return { isValid: true }
  }
}
