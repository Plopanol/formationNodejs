import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

export type MyRequest = Request & { jwtToken?: JwtPayload };

export const isAuthenticated = (req: MyRequest, res: Response, next: NextFunction) => {
    if (req.jwtToken) {
        next();
    } else {
        res.sendStatus(401);
    }
}