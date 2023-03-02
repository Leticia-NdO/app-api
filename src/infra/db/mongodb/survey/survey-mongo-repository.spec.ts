import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

describe('Account Mondo Repository', () => {
  // Quando fazemos testes com bancos de dados é necessário conectar-se ao db antes dos testes e desconectar depois.
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({}) // se passarmos um objeto vazio todos os registros dessa collection vão ser deletados
  })

  const makeFakeAddSurveyModel = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  it('Should add a survey on surveys collection on add success', async () => {
    const sut = makeSut()

    const data = makeFakeAddSurveyModel()

    await sut.add(data)
    const survey = await surveyCollection.findOne({ question: 'any_question' })

    expect(survey).toBeTruthy()
  })
})
