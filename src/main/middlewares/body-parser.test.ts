import request from 'supertest'
import app from '../config/app'

// aula 8 parte 

describe('Body Parser Middleware', () => {
  it('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app).post('/test_body_parser').send({ name: 'Leticia' }).expect({ name: 'Leticia' })
  })
})
