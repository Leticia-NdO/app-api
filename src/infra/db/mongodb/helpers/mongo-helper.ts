import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient, // Porque a sintaxe para atribuir valor há uma chave de objeto e tipo é a mesma, por isso atribuímos um valor null e depois tipamos.
  async connect (url?: string): Promise<void> {
    this.client = new MongoClient(url !== undefined ? url : process.env.MONGO_URL !== undefined ? process.env.MONGO_URL : '', {
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map (collection: any, _id: string): any {
    delete collection._id
    return Object.assign({}, collection, { id: _id })
  }

}
