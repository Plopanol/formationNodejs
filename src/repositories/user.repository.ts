import { DeleteResult, InsertOneResult, ObjectId } from "mongodb";
import { db } from "../configs/mongodb.config";
import { User } from "../models/user.model";

// Repository user
class UserRepository {
    async findAll(): Promise<User[]> {
        return (await db).collection('users')
            .find<User>({})
            .toArray();
    }

    async findById(id: number | ObjectId): Promise<User | null> {
        return (await db).collection<User>('users')
            .findOne({ _id: id });
    }

    async findByEmail(email: string): Promise<User | null> {
        return (await db).collection<User>('users')
            .findOne({ email });
    }

    async findByName(name: string): Promise<User | null> {
        return (await db).collection<User>('users')
            .findOne({ name });
    }

    async findByTitle(titre: string): Promise<User | null> {
        return (await db).collection<User>('users').findOne(
            { title: titre });
    }

    async insertOne(user: User): Promise<User | null> {
        const result: Promise<InsertOneResult<User>> = (await db).collection<User>('users').insertOne(user);
        return result.then(result => ({ ...user, _id: result.insertedId }));
    }

    async update(user: User): Promise<boolean> {
        return (await db).collection<User>('users')
            .replaceOne({ _id: user._id }, user)
            .then(result => result.acknowledged && result.modifiedCount === 1);
    }

    async deleteById(id: number): Promise<Boolean> {
        return (await db).collection<User>('users').deleteOne({ _id: id }).then(result => result.acknowledged && result.deletedCount === 1);
    }
}
// Export pour le rendre accessible
export const userRepository = new UserRepository();