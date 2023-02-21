import { SignUpController } from './signup-controller'
import { EmailInUseError, MissingParamError } from '../../../errors'
import { Validation, AccountModel, AddAccount, AddAccountModel, HttpRequest, Authentication, AuthenticationModel } from './signup-controller-protocols'
import { badRequest, forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { ValidationResult } from '../../../../validation/protocols/validation-result'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@emial.com',
  password: 'valid_password'
})
const makeFakeRequest = (): HttpRequest => (
  {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
)

const makeHttpRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@email.com',
      password: 'any_password'
    }
  }
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (auth: AuthenticationModel): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    // stub é um test double, uma função que tem retorno pré definido. É uma boa prática iniciar o mock com valor positivo
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub()
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
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthenticationStub()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut() // sut = system under test
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('Should return 500 if AddAccount throws', async () => {
    // forçando o EmailValidator a retornar uma exceção pra ser como o try catch vai se comportar
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error('error')))
    })
    const fakeError = new Error()
    fakeError.stack = 'error'

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(fakeError))
  })

  it('Should return 403 if addAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut() // sut = system under test
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null as unknown as AccountModel)))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut() // sut = system under test
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut() // sut = system under test
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if Validation doesn`t return true', async () => {
    // forçando o EmailValidator a retornar uma exceção pra ser como o try catch vai se comportar
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce({
      isValid: false,
      error: new MissingParamError('any_field')
    })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('Should call Authentication with correct values', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith({ email: httpRequest.body.email, password: httpRequest.body.password })
  })

  it('Should return 500 if Authentication throws', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(({ email: string }) => {
      throw new Error('error')
    })

    const res = await sut.handle(httpRequest)

    expect(res).toEqual(serverError(new Error('error')))
  })
})
