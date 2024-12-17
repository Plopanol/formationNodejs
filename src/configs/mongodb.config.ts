import { MongoClient } from "mongodb"

export const db = MongoClient.connect(process.env.MONGO_URL!)
    .then(client => client.db('MovieLens'));
