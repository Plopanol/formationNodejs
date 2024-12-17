import { MongoClient } from "mongodb"

// Permet de créer un connecteur pour la BDD
export const db = MongoClient.connect(process.env.MONGO_URL!)
    .then(client => client.db('MovieLens'));
