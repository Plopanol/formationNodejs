import { Collection, Document, Filter, ObjectId, OptionalUnlessRequiredId, WithId } from "mongodb";
import { db } from "../configs/mongodb.config";

export class GenericRepository<T extends { _id: number | ObjectId }> {

    protected collection: Promise<Collection<T>>;

    constructor(collectionName: string) {
        this.collection = db.then(db => db.collection<T>(collectionName));
    }

    async findAll(): Promise<WithId<T>[]> {
        return (await this.collection)
            .find({})
            .toArray();
    }

    async findById(id: number | ObjectId): Promise<WithId<T> | null> {
        return (await this.collection)
            .findOne({ _id: id } as Filter<T>);
    }

    async save(doc: T): Promise<WithId<T>> {
        return (await this.collection)
            .insertOne(doc as OptionalUnlessRequiredId<T>)
            .then(result => ({ ...doc, _id: result.insertedId } as WithId<T>));
    }

    async update(doc: T): Promise<boolean> {
        return (await this.collection)
            .replaceOne({ _id: doc._id } as Filter<T>, doc)
            .then(result => result.acknowledged && result.modifiedCount === 1);
    }

    async deleteById(id: number | ObjectId): Promise<boolean> {
        return (await this.collection)
            .deleteOne({ _id: id } as Filter<T>)
            .then(result => result.acknowledged && result.deletedCount === 1);
    }

}