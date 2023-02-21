import { HttpRequest } from '../protocols/http'
import { forbidden } from '../helpers/http/http-helper'
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

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in headers', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (token: string): Promise<AccountModel> {
        return makeFakeAccount()
      }
    }

    const loadAccountByTokenStub = new LoadAccountByTokenStub()

    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const httpRequest: HttpRequest = {
      headers: {}
    }
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadAccountByToken with correct values', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (token: string): Promise<AccountModel> {
        return makeFakeAccount()
      }
    }

    const loadAccountByTokenStub = new LoadAccountByTokenStub()

    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }
    await sut.handle(httpRequest)

    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
