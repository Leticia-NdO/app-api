import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({}) // se passarmos um objeto vazio todos os registros dessa collection vão ser deletados
  })

  it('Should return an account on success', async () => {
    await request(app).post('/api/v1/signup')
      .send({
        name: 'leticia',
        email: 'leticia@email.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
