import { HttpRequest } from '../protocols/http'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in headers', async () => {
    const sut = new AuthMiddleware()
    const httpRequest: HttpRequest = {
      headers: {}
    }
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
