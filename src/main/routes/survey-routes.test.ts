import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection
describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    it('Should return 204 on success', async () => {
      await request(app).post('/api/v1/surveys')
        .send({
          question: 'any_question',
          answers: [{
            answer: 'any_answer',
            image: 'image'
          },
          {
            answer: 'any_answer2'
          }]
        })
        .expect(204)
    })
  })
})
