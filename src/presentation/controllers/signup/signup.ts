import { HttpRequest, HttpResponse, Validation, EmailValidator, Controller, AddAccount } from '../signup/signup-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emaiValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emaiValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const res = this.validation.validate(httpRequest.body)

      if (res.error) {
        return badRequest(res.error)
      }

      const { email, password, name } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

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
