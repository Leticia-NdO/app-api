import app from '../config/app'
import request from 'supertest'

// [ ] Aula 8 parte 2 00:00

describe('Content Type Middleware', () => {
  it('Should return default content-type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app).get('/test_content_type')
      .expect('content-type', /json/)
  })

  it('Should return XML content-type when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app).get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
