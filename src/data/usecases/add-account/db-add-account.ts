import { AccountModel, AddAccount, AddAccountModel, Encrypter } from './db-add-account-protocols'
export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  private readonly model = {
    id: 'string',
    name: 'string',
    email: 'string',
    password: 'string'
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve(this.model))
  }
}
