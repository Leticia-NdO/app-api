import { Authentication, InvalidParamError, MissingParamError, badRequest, serverError, unauthorized, HttpRequest, EmailValidator } from './login-protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
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
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return { sut, emailValidatorStub, authenticationStub }
}

describe('Login Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.email
    const { sut } = makeSut()

    const res = await sut.handle(httpRequest)

    expect(res).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.password
    const { sut } = makeSut()

    const res = await sut.handle(httpRequest)

    expect(res).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeHttpRequest()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  it('Should return 400 if invalid email is provided', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const res = await sut.handle(httpRequest)

    expect(res).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email: string) => {
      throw new Error('error')
    })

    const res = await sut.handle(httpRequest)

    expect(res).toEqual(serverError(new Error('error')))
  })

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
})
