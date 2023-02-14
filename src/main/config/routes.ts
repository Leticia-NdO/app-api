import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api/v1', router)
  // fg.sync('**/src/main/routes/**routes.ts').map(async file => {
  //   const route = (await import(`../../../${file}`)).default // o import default desss arquivos é uma função que espera o router como parâmetro
  //   route(router)
  // })
  readdirSync(path.join(`${__dirname}`, '/../routes')).map(async file => {
    if (!file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
