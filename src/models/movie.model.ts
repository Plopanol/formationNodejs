import { ObjectId } from "mongodb";

// Entity Movie
export interface Movie {
    _id?: number | ObjectId;
    genres: string | string[];
    title: string;
    year: number;
}