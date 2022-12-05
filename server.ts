/**
 * @file Implements an Express Node HTTP server.
 */

require('dotenv').config({
    path: "./.env"
});

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import AuthenticationController from './Controllers/AuthenticationController';
import BookmarkController from './Controllers/BookmarkController';
import FollowController from './Controllers/FollowController';
import LikeController from './Controllers/LikeController';
import MessageController from './Controllers/MessageController';
import TuitController from './Controllers/TuitController';
import UserController from './Controllers/UserController';
import BookmarkDao from './mongoose/BookmarkDao';
import FollowDao from './mongoose/FollowDao';
import LikeDao from './mongoose/LikeDao';
import MessageDao from './mongoose/MessageDao';
import TuitDao from './mongoose/TuitDao';
import UserDao from './mongoose/UserDao';

const cors = require('cors');
const app = express();

let sess = {
    secret: process.env.EXPRESS_SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        secure: process.env.NODE_ENV === "production",
    }
}

if (process.env.ENV === 'PRODUCTION') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

const session = require("express-session");

app.use(cors({
    credentials: true,
    origin: process.env.BASE_URL
}));
app.use(session(sess))
app.use(express.json());


const user="vmeet24";
const pwd="c1K7QUUbJcferkyi";

mongoose.connect(`mongodb+srv://${user}:${pwd}@cluster0.2q2gfmo.mongodb.net/FSE?retryWrites=true&w=majority`);

const userDao = new UserDao();
AuthenticationController(app, userDao);

const likesDao = new LikeDao();
new LikeController(app, likesDao);

const followDao = new FollowDao();
new FollowController(app, followDao);

const bookmarkDao = new BookmarkDao();
new BookmarkController(app, bookmarkDao);

const messageDao = new MessageDao();
new MessageController(app, messageDao);

const tuitDao = new TuitDao();
new TuitController(app, tuitDao, bookmarkDao, likesDao, userDao);


new UserController(app, userDao, followDao, tuitDao, bookmarkDao, likesDao);

app.get('/', (req: Request, res: Response) =>
    res.send('Welcome to Foundation of Software Engineering!!!!'));

app.get('/hello', (req: Request, res: Response) =>
    res.send('Welcome to Foundation of Software Engineering!'));

/**
 * Start a server listening at port 4001 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT, () => {
    console.log("Up and Running!");
});
