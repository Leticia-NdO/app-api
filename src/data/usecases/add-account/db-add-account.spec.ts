import { AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
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
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = makeFakeAccount()
    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = makeFakeAccount()
    const promise = sut.add(accountData) // sem await o sut.add retorna uma promise

    // se o encrypter dentro do add retornar uma exce????o eu quero que o add simplesmente retorne essa exce????o e n??o a trate, pois isso ?? dever da camada de presentation (os controllers)
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

  it('Should throw if encrypter throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = makeFakeAccount()
    const promise = sut.add(accountData) // sem await o sut.add retorna uma promise

    // se o reposit??rio dentro do add retornar uma exce????o eu quero que o add simplesmente retorne essa exce????o e n??o a trate, pois isso ?? dever da camada de presentation (os controllers)
    await expect(promise).rejects.toThrow() // vamos desdobrar a promise com o rejects
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = makeFakeAccount()
    const response = await sut.add(accountData) // sem await o sut.add retorna uma promise

    // se o reposit??rio dentro do add retornar uma exce????o eu quero que o add simplesmente retorne essa exce????o e n??o a trate, pois isso ?? dever da camada de presentation (os controllers)
    expect(response).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }) // vamos desdobrar a promise com o rejects
  })
})
