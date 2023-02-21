import { Validation } from '../../../protocols'
import { badRequest, serverError } from '../../login/login/login-controller-protocols'
import { Controller, HttpRequest, HttpResponse, ok, AddSurvey } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { error } = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { answers, question } = httpRequest.body

      await this.addSurvey.add({
        question,
        answers
      })
      return ok('')
    } catch (error) {
      return serverError(error)
    }
  }
}
