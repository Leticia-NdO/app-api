import { Controller } from '../../../../../presentation/protocols'
import { makeDbAddSurvey } from '../../../use-cases/survey/add-survey/db-add-survey-factory'
import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  const dbAddSurvey = makeDbAddSurvey()
  const validations = makeAddSurveyValidation()
  const controller = new AddSurveyController(validations, dbAddSurvey)
  return controller
}
