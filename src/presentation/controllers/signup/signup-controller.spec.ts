import { SignUpController } from './signup-controller'
import { MissingParamError } from '../../errors'
import { Validation, AccountModel, AddAccount, AddAccountModel, HttpRequest } from './signup-controller-protocols'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { ValidationResult } from '../../protocols/validation-result'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
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
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
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

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut() // sut = system under test
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
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
})
