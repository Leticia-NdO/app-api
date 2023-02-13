import { HttpRequest, HttpResponse, Validation, Controller, AddAccount } from './signup-controller-protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResponse = this.validation.validate(httpRequest.body)

      if (validationResponse.error) {
        return badRequest(validationResponse.error)
      }

      const { email, password, name } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
