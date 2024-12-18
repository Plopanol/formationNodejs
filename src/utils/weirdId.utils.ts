import { ObjectId } from "mongodb"

export const idFromString = (id: string): number | ObjectId => {
    return isNaN(Number(id))
        ? new ObjectId(id)
        : Number(id);
}