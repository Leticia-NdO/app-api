import { AccountModel, LoadAccountByEmailRepository, AddAccount, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (account) {
      return null as unknown as AccountModel
    }
    const hashedPassword = await this.hasher.hash(accountData.password)
    const newAccount = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword })) // crio um novo objeto novo, coloco os dados do accountData dentro dele e depois muda a propriedade do passoword
    return newAccount
  }
}
