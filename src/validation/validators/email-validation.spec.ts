import { EmailValidation } from './email-validation'
import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../protocols/email-validator'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // stub é um test double, uma função que tem retorno pré definido. É uma boa prática iniciar o mock com valor positivo
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  it('Should return bad validation result if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut() // sut = system under test
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false) // para inverter o resultado do stub
    const validationResponse = sut.validate({ email: 'invalid_email' })
    expect(validationResponse).toEqual({
      isValid: false,
      error: new InvalidParamError('email')
    })
  })

  it('Should call email validator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut() // sut = system under test
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should throw if EmailValidator throws', async () => {
    // forçando o EmailValidator a retornar uma exceção pra ser como o try catch vai se comportar
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error('error')
    })
    expect(sut.validate).toThrow()
  })
})
