import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepository: LoadAccountByEmailRepository
}

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    email: 'any@email.com',
    name: 'any_name',
    password: 'hashed_password'
  }
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise((resolve, reject) => {
        resolve(makeFakeAccount())
      })
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepository)

  return {
    sut,
    loadAccountByEmailRepository
  }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmail repository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth({ email: 'any@email.com', password: 'any_password' })
    expect(loadSpy).toHaveBeenCalledWith('any@email.com')
  })

  it('Should throw if LoadAccountByEmail repository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))
    const promise = sut.auth({ email: 'any@email.com', password: 'any_password' })
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmail repository returns null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(null as unknown as Promise<AccountModel>)
    const accessToken = await sut.auth({ email: 'any@email.com', password: 'any_password' })
    expect(accessToken).toBeNull()
  })
})
