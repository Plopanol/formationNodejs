import express, { Express } from 'express';
import 'dotenv/config';
import { movieRepository } from '../repositories/movie.repository';
import { Request, Response } from "express";
import { ObjectId } from 'mongodb';
import { MyRequest } from '../middlewares/jwtCkeckValidation.middleware';
import { userRepository } from '../repositories/user.repository';

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

// Update
export const update = async (req: Request, res: Response) => {
    const id: number | ObjectId = isNaN(Number(req.params.id))
        ? new ObjectId(req.params.id)
        : Number(req.params.id);
    const movie = req.body;
    console.log("id: " + id);
    console.log("movie._id: " + movie._id);
    if (id.toString() !== movie._id.toString())
        res.status(400).send('ids in url and body do not match');
    else if (await movieRepository.update(movie))
        res.sendStatus(200);
}

// Delete
export const deleteById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const retour = await movieRepository.deleteById(id);
    if (retour) {
        res.status(200).send();
    } else {
        res.status(404).send(`erreur lors de l'insert:` + id);
    }
}

// Rate
export const vote = async (req: MyRequest, res: Response) => {
    const idMovie: number | ObjectId = isNaN(Number(req.params.id))
        ? new ObjectId(req.params.id)
        : Number(req.params.id);

    const idUser: number | ObjectId = isNaN(Number(req.jwtToken?.sub))
        ? new ObjectId(req.jwtToken?.sub)
        : Number(req.jwtToken?.sub);

    const rating = req.body;
    const retour = await userRepository.ajoutVote(rating, idMovie, idUser);
    if (retour) {
        res.status(200).send();
    } else {
        res.status(404).send(`erreur lors de l'insert:` + vote);
    }
}

// Export afin que le controller soit accessible par l'index.tx
export const router = express.Router();
// On set les routes internes du controller movies
router.get('/', findAll);
router.get('/:id', findById);
router.get('/title/:title', findByTitle);
router.post('/', instertOne);
router.delete('/:id', deleteById);
router.put('/:id', update);
router.post('/vote/:id', vote);