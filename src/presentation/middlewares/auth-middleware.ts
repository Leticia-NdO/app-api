import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const token = httpRequest.headers['x-access-token']
    if (token) {
      const account = await this.loadAccountByToken.load(token)
      if (account) {
        return ok({ accountId: account.id })
      }
    }

    return forbidden(new AccessDeniedError())
  }
}
