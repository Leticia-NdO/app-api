import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.headers.accessToken) {
      return await new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
    }

    return ok('')
  }
}
