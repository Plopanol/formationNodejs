import express, { Express } from 'express';
import 'dotenv/config';
import { movieRepository } from '../repositories/movie.repository';
import { Request, Response } from "express";


export const findAll = async (req: Request, res: Response) => {
    const movies = await movieRepository.findAll();
    res.json(movies);
}

export const findById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const movie = await movieRepository.findById(id);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send(`no movie with id:` + id);
    }
}

export const instertOne = async (req: Request, res: Response) => {
    const movie = req.body;
    const id = await movieRepository.insertOne(movie);
    if (id) {
        res.json(id);
    } else {
        res.status(404).send(`erreur lors de l'insert:` + movie);
    }
}

export const router = express.Router();
router.get('/', findAll);
router.get('/:id', findById);
router.post('/', instertOne);