import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.headers['x-access-token']) {
      return await new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
    }

    const token = httpRequest.headers['x-access-token']

    await this.loadAccountByToken.load(token)

    return ok('')
  }
}
