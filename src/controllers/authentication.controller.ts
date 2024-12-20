import express, { Request, Response } from "express"
import { JwtRequest } from "../models/jwtRequestAuth.modele";
import { userRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import jwt from 'jsonwebtoken';
import { idFromString } from "../utils/weirdId.utils";

const authenticate = async (req: Request, res: Response) => {
    const jwtRequest: JwtRequest = req.body;
    let user;
    switch (jwtRequest.grantType) {
        case 'password':
            user = await userRepository.findByEmail(jwtRequest.email);
            if (user === null ||
                !await bcrypt.compare(jwtRequest.password, user.password))
                res.sendStatus(401);
            else
                res.json({
                    accessToken: generateToken(user, 600),
                    refreshToken: generateToken(user, 3600)
                });
            break;
        case 'refreshToken':
            const decodedRefreshToken = jwt.verify(jwtRequest.refreshToken, process.env.JWT_SECRET!);
            const id = idFromString(decodedRefreshToken.sub as string);
            user = await userRepository.findById(id);
            if (!user)
                res.sendStatus(401);
            else
                res.json({
                    accessToken: generateToken(user, 600),
                    refreshToken: generateToken(user, 3600)
                });
            break;
        default:
            res.sendStatus(400);
    }
}

export const router = express.Router();
router.post('/', authenticate);

const generateToken = (user: User, expires: number): string => {
    return jwt.sign(
        { sub: user._id, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: expires }
    )
}