import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from './validation'
import { ValidationResult } from './validation-result'

export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator

  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

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
