import { ObjectId } from "mongodb";

export interface User {
    _id: number | ObjectId;
    name: string;
    gender: 'F' | 'M';
    occupation: string;
    age: number;
    email: string;
    password: string;
    movies: { movieId: number | ObjectId, rating: number, timestamp: Date }[]
}