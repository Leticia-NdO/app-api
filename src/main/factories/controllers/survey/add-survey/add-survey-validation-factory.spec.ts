import { Validation } from '../../../../../presentation/protocols/validation'
import { ValidationComposite, RequiredFieldValidation } from '../../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddsurveyValidation Factory', () => {
  it('Should call validationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toBeCalledWith(
      validations
    )
  })
})
