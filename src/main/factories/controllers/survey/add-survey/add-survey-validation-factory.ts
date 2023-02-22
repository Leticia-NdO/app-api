import { RequiredFieldValidation } from '../../../../../validation/validators/required-fields-validation'
import { Validation } from '../../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../../validation/validators/validation-composite'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
