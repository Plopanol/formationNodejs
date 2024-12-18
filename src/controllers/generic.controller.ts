import express, { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { idFromString } from "../utils/weirdId.utils";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { GenericRepository } from "../repositories/generic.repository";

export class GenericController<T extends { _id: number | ObjectId; }, R extends GenericRepository<T>> {

    protected repository: R;
    protected _router: Router;

    constructor(repository: R) {
        this.repository = repository;
        this._router = express.Router();
        this._router.get('/', this.findAll);
        this._router.get('/:id', this.findById);
        this._router.post('/', isAuthenticated, this.save);
        this._router.put('/:id', this.update);
        this._router.delete('/:id', this.deleteById);
    }

    async findAll(req: Request, res: Response) {
        const movies = await this.repository.findAll();
        res.json(movies);
    }

    async findById(req: Request, res: Response) {
        const id: number | ObjectId = idFromString(req.params.id);
        const movie = await this.repository.findById(id);
        if (movie)
            res.json(movie);
        else
            res.status(404).send(`no movie with id ${id} exist`);
    }

    async save(req: Request, res: Response) {
        res.json(await this.repository.save(req.body));
    }

    async update(req: Request, res: Response) {
        const id: number | ObjectId = idFromString(req.params.id);
        const movie = req.body;
        if (id.toString() != movie._id)
            res.status(400).send('ids in url and body do not match');
        else if (await this.repository.update({ ...movie, _id: id }))
            res.sendStatus(200);
        else
            res.status(404).send(`no movie with id ${id} exist`);
    }

    async deleteById(req: Request, res: Response) {
        const id: number | ObjectId = idFromString(req.params.id);
        if (await this.repository.deleteById(id))
            res.sendStatus(200);
        else
            res.status(404).send(`no movie with id ${id} exist`);
    }

    get router() {
        return this._router;
    }
}