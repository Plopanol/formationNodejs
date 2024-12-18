import { Collection, InsertOneResult, ObjectId } from "mongodb";
import { db } from "../configs/mongodb.config";

class GenericRepository<T extends Document> {
    collection: Promise<Collection<T>>;


    constructor(collectionName: string) {
        this.collection = db.then(db => db.collection<T>(collectionName));
    }

    async findById(id: number | ObjectId): Promise<T | null> {
        return this.collection.findOne({ _id: id });
    }

    async insertOne(user: T): Promise<T | null> {
        const result: Promise<InsertOneResult<T>> = (await db).collection<T>('users').insertOne(user);
        return result.then(result => ({ ...user, _id: result.insertedId }));
    }

    async update(user: T): Promise<boolean> {
        return (await db).collection<T>('users')
            .replaceOne({ _id: user._id }, user)
            .then(result => result.acknowledged && result.modifiedCount === 1);
    }

    async deleteById(id: number): Promise<Boolean> {
        return (await db).collection<T>('users').deleteOne({ _id: id }).then(result => result.acknowledged && result.deletedCount === 1);
    }
}