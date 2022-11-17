import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }
}))

describe('Bcrypt Adapter', () => {
  it('Should call Bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    jest.spyOn(bcrypt, 'hash')
    const password = 'valid_password'
    await sut.encrypt(password)

    expect(bcrypt.hash).toBeCalledWith(password, salt)
  })

  it('Should return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const password = 'valid_password'
    const hash = await sut.encrypt(password)

    expect(hash).toBe('hash')
  })
})
