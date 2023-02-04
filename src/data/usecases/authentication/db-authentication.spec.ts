import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmail repository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        return await new Promise((resolve, reject) => {
          resolve({
            id: 'any_id',
            email: 'any@email.com',
            name: 'any_name',
            password: 'hashed_password'
          })
        })
      }
    }
    const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepository)
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth({ email: 'any@email.com', password: 'any_password' })
    expect(loadSpy).toHaveBeenCalledWith('any@email.com')
  })
})
