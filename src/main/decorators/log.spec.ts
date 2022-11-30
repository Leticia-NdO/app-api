import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface sutTypes {
  controllerStub: Controller
  sut: LogControllerDecorator
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => resolve({
        statusCode: 200,
        body: {
        }
      }))
    }
  }
  return new ControllerStub()
}

const makeSut = (): sutTypes => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub)
  return { controllerStub, sut }
}

describe('LogControllerDecorator', () => {
  it('Should call controller handle function', async () => {
    const { sut, controllerStub } = makeSut()
    const sutHandleMethod = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        email: '',
        name: '',
        password: '',
        passwordConfirmation: ''
      }
    }
    await sut.handle(httpRequest)
    expect(sutHandleMethod).toHaveBeenCalledWith(httpRequest)
  })
})
