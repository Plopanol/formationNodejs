import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";

export const tokenExpiredErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof TokenExpiredError)
        res.sendStatus(401)
    else
        next();

}   