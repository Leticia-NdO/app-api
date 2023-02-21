import { Validation } from '../../../protocols'
import { badRequest } from '../../login/login/login-controller-protocols'
import { Controller, HttpRequest, HttpResponse, ok } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { error } = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }
    return ok('')
  }
}
