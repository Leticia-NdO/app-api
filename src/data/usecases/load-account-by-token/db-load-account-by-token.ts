import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}
  async load (token: string, role?: string | undefined): Promise<AccountModel> {
    const account = await this.decrypter.decrypt(token)
    if (!account) {
      return null as unknown as AccountModel
    }
    return {
      id: 'any_id',
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password'
    }
  }
}
