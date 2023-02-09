import { AccountModel, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new HasherStub()
}

const makeFakeAccount = (): AddAccountModel => {
  return {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(Object.assign({}, accountData, { id: 'valid_id' })))
    }
  }

  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = makeFakeAccount()
    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = makeFakeAccount()
    const promise = sut.add(accountData) // sem await o sut.add retorna uma promise

    // se o hasher dentro do add retornar uma exceção eu quero que o add simplesmente retorne essa exceção e não a trate, pois isso é dever da camada de presentation (os controllers)
    await expect(promise).rejects.toThrow() // vamos desdobrar a promise com o rejects
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeFakeAccount()
    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  it('Should throw if hasher throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = makeFakeAccount()
    const promise = sut.add(accountData) // sem await o sut.add retorna uma promise

    // se o repositório dentro do add retornar uma exceção eu quero que o add simplesmente retorne essa exceção e não a trate, pois isso é dever da camada de presentation (os controllers)
    await expect(promise).rejects.toThrow() // vamos desdobrar a promise com o rejects
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = makeFakeAccount()
    const response = await sut.add(accountData) // sem await o sut.add retorna uma promise

    // se o repositório dentro do add retornar uma exceção eu quero que o add simplesmente retorne essa exceção e não a trate, pois isso é dever da camada de presentation (os controllers)
    expect(response).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }) // vamos desdobrar a promise com o rejects
  })
})
