import express, { Request, Response } from "express"
import { JwtRequest } from "../models/jwtRequestAuth.modele";
import { userRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import jwt from 'jsonwebtoken';

export const authenticate = async (req: Request, res: Response) => {
    const jwtRequest: JwtRequest = req.body;
    switch (jwtRequest.grantType) {
        case 'password':
            const user = await userRepository.findByEmail(jwtRequest.email);
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
            res.status(401).send('Invalid credentials');
            break;
        default:
            break;
    }
}

export const router = express.Router();
router.post('/', authenticate);

const generateToken = (user: User, expires: number) => {
    return jwt.sign(
        { sub: user._id, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: expires }
    )
}