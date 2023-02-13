import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller, private readonly logErrorRepository: LogErrorRepository) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const result = await this.controller.handle(httpRequest)
    if (result.statusCode === 500) {
      await this.logErrorRepository.logError(result.body.stack)
    }

    return result
  }
}
