import express, { Express } from 'express';
import 'dotenv/config';
import { db } from './configs/mongodb.config';
// Import utilisaant un alias
import { router as movieRouter } from './controllers/movie.controller';
import { router as userRouter } from './controllers/user.controller';
import { router as authenticationRouter } from './controllers/authentication.controller';
import { jwtCheckValidation } from './middlewares/jwtCkeckValidation.middleware'
import { isAnonymous } from './middlewares/isAnonymous.middleware'
import { isAuthenticated } from './middlewares/isAuthenticated.middleware'
import { tokenExpiredErrorHandler } from './middlewares/errorHandlers.middleware';

const app: Express = express();

// Permet d'ajouter le parser automatiquement sur les routes Rest
app.use(express.json());
app.use(jwtCheckValidation);

// Exemple pour executer une requete mongodb
db.then(db => db.collection('movies').find({}).limit(10).forEach(m => console.log(m)));

// On assigne la route /movies à un controlleur movieRouter
app.use('/movies', movieRouter);
// Ajout le middleware authentication
app.use('/users', userRouter);
app.use('/authenticate', authenticationRouter);

// Listener sur la root /
app.get('/', (req, res) => {
    res.send("Hello World 2");
})

// Listener sur le port 3000
app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
})

app.use(tokenExpiredErrorHandler);