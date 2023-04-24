import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const password = await hash('123', 12)
  const res = await accountCollection.insertOne({
    name: 'leticia',
    email: 'leticia@email.com',
    password,
    role: 'admin'
  })
  const accessToken = sign(res.insertedId.toString(), env.jwtSecret)
  await accountCollection.updateOne({
    _id: res.insertedId
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({}) // se passarmos um objeto vazio todos os registros dessa collection vão ser deletados
    await accountCollection.deleteMany({}) // se passarmos um objeto vazio todos os registros dessa collection vão ser deletados
  })

  describe('POST /surveys', () => {
    it('Should return 403 on request without access token', async () => {
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
        .expect(403)
    })

    it('Should return 204 on request with valid access token', async () => {
      const accessToken = await makeAccessToken()
      await request(app).post('/api/v1/surveys')
        .set('x-access-token', accessToken)
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

  describe('GET /surveys', () => {
    it('Should return 403 on load surveys without access token', async () => {
      await request(app).get('/api/v1/surveys')
        .expect(403)
    })

    it('Should return 204 on load surveys with valid access token', async () => {
      const accessToken = await makeAccessToken()

      await request(app).get('/api/v1/surveys')
        .set('x-access-token', accessToken)
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
