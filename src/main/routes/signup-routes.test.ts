import app from '../config/app'
import request from 'supertest'

describe('SignUp Routes', () => {
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
