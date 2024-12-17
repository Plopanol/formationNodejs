import express, { Express } from 'express';
import 'dotenv/config';
import { movieRepository } from '../repositories/movie.repository';
import { Request, Response } from "express";


export const findAll = async (req: Request, res: Response) => {
    const movies = await movieRepository.findAll();
    res.json(movies);
}

export const router = express.Router();
router.get('/', findAll);