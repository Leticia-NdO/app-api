import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({}) // se passarmos um objeto vazio todos os registros dessa collection vão ser deletados
  })

  describe('POST /signup', () => {
    it('Should return 200 on sign up', async () => {
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

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'leticia',
        email: 'leticia@email.com',
        password
      })
      await request(app).post('/api/v1/login')
        .send({
          email: 'leticia@email.com',
          password: '123'
        })
        .expect(200)
    })

    it('Should return 401 on login failure', async () => {
      await request(app).post('/api/v1/login')
        .send({
          email: 'leticia@email.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
