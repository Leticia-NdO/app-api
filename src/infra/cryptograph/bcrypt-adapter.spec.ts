import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

describe('Bcrypt Adapter', () => {
  it('Should call Bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    jest.spyOn(bcrypt, 'hash')
    const password = 'valid_password'
    await sut.encrypt(password)

    expect(bcrypt.hash).toBeCalledWith(password, salt)
  })

  
})
