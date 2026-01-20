import { MongoClient, Db } from 'mongodb'

// Permitir build sin MONGODB_URI (Vercel inyecta las env vars después del build)
const uri = process.env.MONGODB_URI || ''
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// En desarrollo, usamos una variable global para preservar la conexión
// entre recargas de HMR (Hot Module Replacement)
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export default clientPromise!

export async function getDatabase(): Promise<Db> {
  if (!uri) {
    throw new Error('MONGODB_URI no está configurada')
  }
  const client = await clientPromise
  return client.db('tickets_db')
}
