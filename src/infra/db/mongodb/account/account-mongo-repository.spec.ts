import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  // Quando fazemos testes com bancos de dados é necessário conectar-se ao db antes dos testes e desconectar depois.
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({}) // se passarmos um objeto vazio todos os registros dessa collection vão ser deletados
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    it('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add({
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password'
      }
      )

      expect(account).toBeTruthy()

      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail', () => {
    it('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password'
      })

      const account = await sut.loadByEmail(
        'any_email@email.com'
      )

      expect(account).toBeTruthy()

      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })

    it('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail(
        'any_email@email.com'
      )

      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken', () => {
    it('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()

      const result = await accountCollection.insertOne({
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password'
      })

      await sut.updateAccessToken(result.insertedId.toString(), 'any_token')
      const account = await accountCollection.findOne({ email: 'any_email@email.com' })

      expect(account).toBeTruthy()
      expect(account?.accessToken).toEqual('any_token')
    })
  })

  describe('loadByToken', () => {
    it('Should return an account on loadByToken without role success', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        accessToken: 'any_token'
      })

      const account = await sut.loadByToken(
        'any_token'
      )

      expect(account).toBeTruthy()

      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })

    it('Should return an account on loadByToken with admin role success', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      })

      const account = await sut.loadByToken(
        'any_token',
        'admin'
      )

      expect(account).toBeTruthy()

      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })

    it('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        accessToken: 'any_token'
      })

      const account = await sut.loadByToken(
        'any_token',
        'admin'
      )
      expect(account).toBeFalsy()
    })

    it('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      })

      const account = await sut.loadByToken(
        'any_token'
      )

      expect(account).toBeTruthy()

      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })

    it('Should return null if loadByToken fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByToken(
        'any_token'
      )

      expect(account).toBeFalsy()
    })
  })
})
