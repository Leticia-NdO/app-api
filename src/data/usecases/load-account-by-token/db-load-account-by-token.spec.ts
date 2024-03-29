import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepository: LoadAccountByTokenRepository
}

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'valid_name',
    email: 'valid@email.com',
    password: 'valid_password'
  }
}

const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (email: string, role?: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new DecrypterStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepository = makeLoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepository)

  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepository
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  it('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load('any_token')

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return null if decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null as unknown as string)))

    const response = await sut.load('any_token', 'any_role')

    expect(response).toBeNull()
  })

  it('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepository } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepository, 'loadByToken')

    await sut.load('any_token', 'any_role')

    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  it('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepository } = makeSut()
    jest.spyOn(loadAccountByTokenRepository, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null as unknown as AccountModel)))

    const response = await sut.load('any_token', 'any_role')

    expect(response).toBeNull()
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()

    const response = await sut.load('any_token', 'any_role')

    expect(response).toEqual(makeFakeAccount())
  })

  it('Should throw if decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error()))) // sem await o sut.add retorna uma promise
    const response = sut.load('any_token', 'any_role')

    // se o repositório dentro do add retornar uma exceção eu quero que o add simplesmente retorne essa exceção e não a trate, pois isso é dever da camada de presentation (os controllers)
    await expect(response).rejects.toThrow() // vamos desdobrar a promise com o rejects
  })

  it('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepository } = makeSut()
    jest.spyOn(loadAccountByTokenRepository, 'loadByToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error()))) // sem await o sut.add retorna uma promise
    const response = sut.load('any_token', 'any_role')

    // se o repositório dentro do add retornar uma exceção eu quero que o add simplesmente retorne essa exceção e não a trate, pois isso é dever da camada de presentation (os controllers)
    await expect(response).rejects.toThrow() // vamos desdobrar a promise com o rejects
  })
})
