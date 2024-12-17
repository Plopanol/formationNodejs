import express, { Express } from 'express';
import 'dotenv/config';
import { movieRepository } from '../repositories/movie.repository';
import { Request, Response } from "express";
import { ObjectId } from 'mongodb';

// Controller pour la route /movies

// FindAll
export const findAll = async (req: Request, res: Response) => {
    const movies = await movieRepository.findAll();
    res.json(movies);
}

// FindById
export const findById = async (req: Request, res: Response) => {
    const id: number | ObjectId = isNaN(Number(req.params.id))
        ? new ObjectId(req.params.id)
        : Number(req.params.id);
    const movie = await movieRepository.findById(id);
    if (movie)
        res.json(movie);
    else
        res.status(404).send(`no movie with id ${id} exist`);
}

// FindByTitle
export const findByTitle = async (req: Request, res: Response) => {
    const title = String(req.params.title);
    const movie = await movieRepository.findByTitle(title);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send(`no movie with title:` + title);
    }
}

// Save
export const instertOne = async (req: Request, res: Response) => {
    const movie = req.body;
    const id = await movieRepository.insertOne(movie);
    if (id) {
        res.json(id);
    } else {
        res.status(404).send(`erreur lors de l'insert:` + movie);
    }
}

// Delete
export const deleteById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await movieRepository.deleteById(id);
}

// Export afin que le controller soit accessible par l'index.tx
export const router = express.Router();
// On set les routes internes du controller movies
router.get('/', findAll);
router.get('/:id', findById);
router.get('/title/:title', findByTitle);
router.post('/', instertOne);