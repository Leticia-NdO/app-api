import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/db-load-surveys-repository'
import { AddSurveyModel, AddSurveyRepository } from '../../../../data/usecases/add-survey/db-add-survey-protocols'
import { SurveyModel } from '../../../../domain/models/survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (data: AddSurveyModel): Promise<void> {
    const surveysCollection = await MongoHelper.getCollection('surveys')

    await surveysCollection.insertOne(data)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveysCollection = await MongoHelper.getCollection('surveys')

    const surveys = await surveysCollection.find().toArray() as unknown as SurveyModel[]

    return surveys
  }
}
