/**
 * @file Implements an Express Node HTTP server.
 */
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
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
app.use(cors());
app.use(express.json());

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.2q2gfmo.mongodb.net/FSE?retryWrites=true&w=majority`);

const userDao = new UserDao();
new UserController(app, userDao);

const tuitDao = new TuitDao();
new TuitController(app, tuitDao);

const likesDao = new LikeDao();
new LikeController(app, likesDao);

const followDao = new FollowDao();
new FollowController(app, followDao);

const bookmarkDao = new BookmarkDao();
new BookmarkController(app, bookmarkDao);

const messageDao = new MessageDao();
new MessageController(app, messageDao);

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
