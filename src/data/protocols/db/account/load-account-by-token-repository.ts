import { AccountModel } from '../../../usecases/add-account/db-add-account-protocols'

export interface LoadAccountByTokenRepository {
  loadByToken: (email: string) => Promise<AccountModel>
}
