import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

export type MyRequest = Request & { jwtToken?: JwtPayload };

export const jwtCheckValidation = (req: MyRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        if (!authorizationHeader.match(/^Bearer /)) {
            res.sendStatus(401);
            return;
        }
        const token = authorizationHeader.slice(7);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
        req.jwtToken = decodedToken as JwtPayload;
    }
    next();
}