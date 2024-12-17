import { InsertOneResult } from "mongodb";
import { db } from "../configs/mongodb.config";
import { Movie } from "../models/movie.model";

class MovieRepository {
    async findAll(): Promise<Movie[]> {
        return (await db).collection('movies')
            .find<Movie>({})
            .toArray();
    }

    async findById(id: number): Promise<Movie | null> {
        return (await db).collection<Movie>('movies').findOne(
            { _id: id });
    }

    async insertOne(doc: Movie): Promise<Number | null> {
        const result: Promise<InsertOneResult<Movie>> = (await db).collection<Movie>('movies').insertOne(doc);
        return (await result.then()).insertedId;
    }
}

export const movieRepository = new MovieRepository();