import { Authentication, Validation, MissingParamError, badRequest, serverError, ok, unauthorized, HttpRequest } from './login-protocols'
import { LoginController } from './login'
import { ValidationResult } from '../../protocols/validation-result'

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
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
    async auth (email: string, password: string): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return { sut, authenticationStub, validationStub }
}

describe('Login Controller', () => {
  it('Should call Authentication with correct values', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  it('Should return 401 if invalid credentials are provided', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve('')))

    const res = await sut.handle(httpRequest)

    expect(res).toEqual(unauthorized())
  })

  it('Should return 500 if Authentication throws', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce((email: string) => {
      throw new Error('error')
    })

    const res = await sut.handle(httpRequest)

    expect(res).toEqual(serverError(new Error('error')))
  })

  it('Should return 200 if valid credentials are provided', async () => {
    const httpRequest = makeHttpRequest()
    const { sut } = makeSut()
    const res = await sut.handle(httpRequest)

    expect(res).toEqual(ok({ accessToken: 'any_token' }))
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut() // sut = system under test
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeHttpRequest()
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

    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
