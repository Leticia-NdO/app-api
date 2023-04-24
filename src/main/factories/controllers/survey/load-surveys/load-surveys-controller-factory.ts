import { Controller } from '../../../../../presentation/protocols'
import { makeDbLoadSurveys } from '../../../use-cases/survey/load-surveys/db-load-surveys-factory'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return controller
}
