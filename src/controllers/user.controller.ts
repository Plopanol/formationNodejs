import express, { Express } from 'express';
import 'dotenv/config';
import { userRepository } from '../repositories/user.repository';
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ObjectId } from 'mongodb';
import { isAuthenticate } from '../middleware/isAuthenticate.middleware';

// Controller pour la route /users

// FindAll
export const findAll = async (req: Request, res: Response) => {
    const users = await userRepository.findAll();
    res.json(users);
}

// FindById
export const findById = async (req: Request, res: Response) => {
    const id: number | ObjectId = isNaN(Number(req.params.id))
        ? new ObjectId(req.params.id)
        : Number(req.params.id);
    const user = await userRepository.findById(id);
    if (user)
        res.json(user);
    else
        res.status(404).send(`no user with id ${id} exist`);
}

// FindByTitle
export const findByEmail = async (req: Request, res: Response) => {
    const email = String(req.params.email);
    const user = await userRepository.findByEmail(email);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send(`no user with email:` + email);
    }
}


// FindByTitle
export const findByName = async (req: Request, res: Response) => {
    const name = String(req.params.name);
    const user = await userRepository.findByName(name);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send(`no user with name:` + name);
    }
}


// Save
export const instertOne = async (req: Request, res: Response) => {
    const user = req.body;
    user.password = await bcrypt.hash(user.password, 10);
    const id = await userRepository.insertOne(user);
    if (id) {
        res.json(id);
    } else {
        res.status(404).send(`erreur lors de l'insert:` + user);
    }
}

// Update
export const update = async (req: Request, res: Response) => {
    const id: number | ObjectId = isNaN(Number(req.params.id))
        ? new ObjectId(req.params.id)
        : Number(req.params.id);
    const user = req.body;
    console.log("id: " + id);
    console.log("user._id: " + user._id);
    if (id.toString() !== user._id.toString())
        res.status(400).send('ids in url and body do not match');
    else if (await userRepository.update(user))
        res.sendStatus(200);
}

// Delete
export const deleteById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const retour = await userRepository.deleteById(id);
    if (retour) {
        res.status(200).send();
    } else {
        res.status(404).send(`erreur lors de l'insert:` + id);
    }
}

// Export afin que le controller soit accessible par l'index.tx
export const router = express.Router();
router.use(isAuthenticate);
// On set les routes internes du controller users
router.get('/', findAll);
router.get('/:id', findById);
router.get('/email/:email', findByEmail);
router.get('/name/:name', findByName);
router.post('/', instertOne);
router.delete('/:id', deleteById);
router.put('/:id', update);