import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'
import { ValidationResult } from './validation-result'

interface SutTypes {
  sut: ValidationComposite
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): ValidationResult {
      return {
        isValid: true
      }
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub
  }
}

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValue({ isValid: false, error: new MissingParamError('field') })
    const res = sut.validate({ field: 'any_value' })
    expect(res).toEqual({ isValid: false, error: new MissingParamError('field') })
  })
})
