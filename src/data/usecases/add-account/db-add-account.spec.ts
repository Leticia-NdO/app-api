import { AccountModel, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'

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
    email: 'valid@email.com',
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

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await new Promise((resolve, reject) => {
        resolve(null as unknown as AccountModel)
      })
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepository: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepository)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepository
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
      email: 'valid@email.com',
      password: 'hashed_password'
    })
  })

  it('Should call LoadAccountByEmail repository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')
    await sut.add(makeFakeAccount())
    expect(loadSpy).toHaveBeenCalledWith('valid@email.com')
  })

  it('Should throw if hasher throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = makeFakeAccount()
    const promise = sut.add(accountData) // sem await o sut.add retorna uma promise

    // se o repositório dentro do add retornar uma exceção eu quero que o add simplesmente retorne essa exceção e não a trate, pois isso é dever da camada de presentation (os controllers)
    await expect(promise).rejects.toThrow() // vamos desdobrar a promise com o rejects
  })

  it('Should return null if LoadAccountByEmailRepository returns not null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const accountData = makeFakeAccount()
    jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(Object.assign({}, accountData, { id: 'any_id' }))))
    const response = await sut.add(accountData) // sem await o sut.add retorna uma promise

    // se o repositório dentro do add retornar uma exceção eu quero que o add simplesmente retorne essa exceção e não a trate, pois isso é dever da camada de presentation (os controllers)
    expect(response).toBeNull()
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = makeFakeAccount()
    const response = await sut.add(accountData) // sem await o sut.add retorna uma promise

    // se o repositório dentro do add retornar uma exceção eu quero que o add simplesmente retorne essa exceção e não a trate, pois isso é dever da camada de presentation (os controllers)
    expect(response).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'hashed_password'
    }) // vamos desdobrar a promise com o rejects
  })
})
