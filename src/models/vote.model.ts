import { ObjectId } from "mongodb";

export interface Vote {
    movieid: number | ObjectId,
    rating: number;
}