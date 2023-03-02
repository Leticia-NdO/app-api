import { ok } from '../../login/login/login-controller-protocols'
import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load()
    return ok(surveys)
  }
}
