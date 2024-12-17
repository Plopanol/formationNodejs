import { DeleteResult, InsertOneResult, ObjectId } from "mongodb";
import { db } from "../configs/mongodb.config";
import { Movie } from "../models/movie.model";

// Repository Movie
class MovieRepository {
    async findAll(): Promise<Movie[]> {
        return (await db).collection('movies')
            .find<Movie>({})
            .toArray();
    }

    async findById(id: number | ObjectId): Promise<Movie | null> {
        return (await db).collection<Movie>('movies')
            .findOne({ _id: id });
    }

    async findByTitle(titre: string): Promise<Movie | null> {
        return (await db).collection<Movie>('movies').findOne(
            { title: titre });
    }

    async insertOne(movie: Movie): Promise<Movie | null> {
        const result: Promise<InsertOneResult<Movie>> = (await db).collection<Movie>('movies').insertOne(movie);
        return result.then(result => ({ ...movie, _id: result.insertedId }));
    }

    async deleteById(id: number): Promise<Boolean> {
        return (await db).collection<Movie>('movies').deleteOne({ _id: id }).then(result => result.acknowledged);
    }
}
// Export pour le rendre accessible
export const movieRepository = new MovieRepository();