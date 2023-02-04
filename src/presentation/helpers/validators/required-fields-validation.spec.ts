import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-fields-validation'

const makeFakeInput = (): any => {
  return {
    name: 'valid name',
    email: 'valid@email.com',
    password: 'valid_password',
    passoword: 'valid_password'
  }
}

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('Required Fields Validation', () => {
  it('Should return a missing param error if validation fails', () => {
    const sut = makeSut()
    const res = sut.validate(makeFakeInput())
    expect(res).toEqual({
      isValid: false,
      error: new MissingParamError('field')
    })
  })

  it('Should return isValid true if validation succeeds', () => {
    const sut = makeSut()
    const res = sut.validate({ field: 'any_field' })
    expect(res).toEqual({
      isValid: true
    })
  })
})
