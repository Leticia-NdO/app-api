import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
}
const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return { sut }
}

describe('Login Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const { sut } = makeSut()

    const res = await sut.handle(httpRequest)

    expect(res).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const { sut } = makeSut()

    const res = await sut.handle(httpRequest)

    expect(res).toEqual(badRequest(new MissingParamError('password')))
  })
})
