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

describe('Required Fields Validation', () => {
  it('Should return a missing param error if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const res = sut.validate(makeFakeInput())
    expect(res).toEqual({
      isValid: false,
      error: new MissingParamError('field')
    })
  })
})
