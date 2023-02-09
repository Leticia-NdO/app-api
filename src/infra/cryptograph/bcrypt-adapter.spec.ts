import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  it('Should call hash method with correct values', async () => {
    const sut = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const password = 'valid_password'
    await sut.hash(password)

    expect(hashSpy).toBeCalledWith(password, salt)
  })

  it('Should return a valid hash on hash method success', async () => {
    const sut = makeSut()
    const password = 'valid_password'
    const hash = await sut.hash(password)

    expect(hash).toBe('hash')
  })

  it('Should call compare method with correct values', async () => {
    const sut = makeSut()

    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')

    expect(compareSpy).toBeCalledWith('any_value', 'any_hash')
  })

  it('Should return true when compare method succeeds', async () => {
    const sut = makeSut()
    const response = await sut.compare('any_value', 'any_hash')

    expect(response).toBe(true)
  })

  it('Should return false when compare method fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)) as unknown as void)
    const response = await sut.compare('any_value', 'any_hash')

    expect(response).toBe(false)
  })

  it('Should throws if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
    const password = 'valid_password'
    const promise = sut.hash(password)

    await expect(promise).rejects.toThrow()
  })
})
