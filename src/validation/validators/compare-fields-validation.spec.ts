import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('Compare Fields Validation', () => {
  it('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const res = sut.validate({ field: 'any_field', fieldToCompare: 'invalid_field' })
    expect(res).toEqual({
      isValid: false,
      error: new InvalidParamError('fieldToCompare')
    })
  })

  it('Should return isValid true if validation succeeds', () => {
    const sut = makeSut()
    const res = sut.validate({ field: 'any_field', fieldToCompare: 'any_field' })
    expect(res).toEqual({
      isValid: true
    })
  })
})
