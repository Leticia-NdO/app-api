import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory'
import { makeLogControllerDecorator } from '../factories/decorators/log-controller-decorator-factory'

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeLogControllerDecorator(makeAddSurveyController())))
}
