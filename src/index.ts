import express, { Express } from 'express';
import 'dotenv/config';
import { db } from './configs/mongodb.config';
// Import utilisaant un alias
import { router as movieRouter } from './controllers/movie.controller';

const app: Express = express();
// Permet d'ajouter le parser automatiquement sur les routes Rest
app.use(express.json());

// Exemple pour executer une requete mongodb
db.then(db => db.collection('movies').find({}).limit(10).forEach(m => console.log(m)));

// On assigne la route /movies à un controlleur movieRouter
app.use('/movies', movieRouter);

// Listener sur la root /
app.get('/', (req, res) => {
    res.send("Hello World 2");
})

// Listener sur le port 3000
app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
})