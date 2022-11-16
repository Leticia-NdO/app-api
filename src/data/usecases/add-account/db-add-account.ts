import { AccountModel, AddAccount, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  private readonly model = {
    id: 'string',
    name: 'string',
    email: 'string',
    password: 'string'
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword })) // crio um novo objeto novo, coloco os dados do accountData dentro dele e depois muda a propriedade do passoword
    return await new Promise(resolve => resolve(this.model))
  }
}
