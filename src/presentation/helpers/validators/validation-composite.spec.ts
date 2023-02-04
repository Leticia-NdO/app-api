import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'
import { ValidationResult } from '../../protocols/validation-result'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
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
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[0], 'validate').mockReturnValue({ isValid: false, error: new MissingParamError('field') })
    const res = sut.validate({ field: 'any_value' })
    expect(res).toEqual({ isValid: false, error: new MissingParamError('field') })
  })

  it('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[0], 'validate').mockReturnValue({ isValid: false, error: new Error() })
    jest.spyOn(validationStubs[1], 'validate').mockReturnValue({ isValid: false, error: new MissingParamError('field') })
    const res = sut.validate({ field: 'any_value' })
    expect(res).toEqual({ isValid: false, error: new Error() })
  })

  it('Should return isValid = true if all validations succeeds', () => {
    const { sut } = makeSut()

    const res = sut.validate({ field: 'any_value' })
    expect(res).toEqual({ isValid: true })
  })
})
