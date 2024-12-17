import { db } from "../configs/mongodb.config";
import { Movie } from "../models/movie.model";

class MovieRepository {
    async findAll(): Promise<Movie[]> {
        return (await db).collection('movies')
            .find<Movie>({})
            .toArray();
    }
}

export const movieRepository = new MovieRepository();