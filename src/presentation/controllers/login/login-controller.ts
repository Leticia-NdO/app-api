import { Authentication, Validation, ok, badRequest, serverError, unauthorized, Controller, HttpRequest, HttpResponse } from './login-controller-protocols'

export class LoginController implements Controller {
  private readonly authentication: Authentication
  private readonly validation: Validation
  constructor (authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResponse = this.validation.validate(httpRequest.body)

      if (validationResponse.error) {
        return badRequest(validationResponse.error)
      }

      const { email, password } = httpRequest.body

      const accessToken = await this.authentication.auth({ email, password })

      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
