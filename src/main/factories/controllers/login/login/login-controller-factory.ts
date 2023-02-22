import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '../../../../../presentation/controllers/login/login/login-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeDbAuthentication } from '../../../use-cases/account/authentication/db-authentication-factory'

export const makeLoginController = (): Controller => {
  const authentication = makeDbAuthentication()
  const loginController = new LoginController(authentication, makeLoginValidation())
  return loginController
}
