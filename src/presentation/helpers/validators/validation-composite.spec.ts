import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'
import { ValidationResult } from './validation-result'

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate (input: any): ValidationResult {
        return {
          isValid: false,
          error: new MissingParamError('field')
        }
      }
    }
    const sut = new ValidationComposite([new ValidationStub()])
    const res = sut.validate({ field: 'any_value' })
    expect(res).toEqual({ isValid: false, error: new MissingParamError('field') })
  })
})
