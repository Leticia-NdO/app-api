import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  url: null as unknown as string,
  client: null as unknown as MongoClient, // Porque a sintaxe para atribuir valor há uma chave de objeto e tipo é a mesma, por isso atribuímos um valor null e depois tipamos.
  async connect (url: string): Promise<void> {
    this.url = url
    this.client = new MongoClient(url, {
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.url)
    }
    return this.client.db().collection(name)
  },

  map (collection: any, _id: string): any {
    delete collection._id
    return Object.assign({}, collection, { id: _id })
  }

}
