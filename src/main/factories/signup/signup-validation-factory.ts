import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite, CompareFieldsValidation, RequiredFieldValidation, EmailValidation } from '../../../presentation/helpers/validators'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
