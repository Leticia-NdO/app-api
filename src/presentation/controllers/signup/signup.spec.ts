import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from '../signup/signup-protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
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
// [ ] criar interfaces: aula 3 parte 5. integrando com o AddAccount Usecase 15:30

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    // stub é um test double, uma função que tem retorno pré definido. É uma boa prática iniciar o mock com valor positivo
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@emial.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }

  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const { sut } = makeSut() // sut = system under test
    const httpRequest = {
      body: {
        email: 'any_email2mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', () => {
    const { sut } = makeSut() // sut = system under test
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    const { sut } = makeSut() // sut = system under test
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email2mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut() // sut = system under test
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email2mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if passwordConfirmation fails', () => {
    const { sut } = makeSut() // sut = system under test
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email2mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut() // sut = system under test
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false) // para inverter o resultado do stub
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email2mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut() // sut = system under test
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'valid_email2mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('valid_email2mail.com')
  })

  it('Should return 500 if EmailValidator throws', () => {
    // forçando o EmailValidator a retornar uma exceção pra ser como o try catch vai se comportar
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut() // sut = system under test
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'valid_email2mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'valid_email2mail.com',
      password: 'any_password'
    })
  })
})
