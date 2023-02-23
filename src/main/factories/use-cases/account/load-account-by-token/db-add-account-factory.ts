import { DbLoadAccountByToken } from '../../../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '../../../../../infra/cryptograph/jwt/jwt-adapter'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../../config/env'

export const makeDbLoadAccountByToken = (): DbLoadAccountByToken => {
  const decrypter = new JwtAdapter(env.jwtSecret)
  const loadAccountByTokenRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(decrypter, loadAccountByTokenRepository)
}
