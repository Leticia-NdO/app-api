import { HttpRequest } from '../protocols/http'
import { forbidden, ok } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { AuthMiddleware } from './auth-middleware'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'valid_name',
    email: 'valid@email.com',
    password: 'valid_password'
  }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  }
}

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }

  return new LoadAccountByTokenStub()
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      headers: {}
    }
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadAccountByToken with correct values', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null as unknown as AccountModel)))
    const httpRequest: HttpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(ok({ accountId: 'any_id' }))
  })

  it('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRequest: HttpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toEqual(500)
  })
})
