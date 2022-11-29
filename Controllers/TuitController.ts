import { Request, Response, Express } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import ITuitController from "../interfaces/ITuitController";
import ITuitDao from "../interfaces/ITuitDao";
import IUserDao from "../interfaces/IUserDao";
import BookmarkDao from "../mongoose/BookmarkDao";
import LikeDao from "../mongoose/LikeDao";

export default class TuitController implements ITuitController {

    private app: Express;
    private tuitDao: ITuitDao;
    private userDao: IUserDao;
    private bookmarkDao: BookmarkDao;
    private likeDao: LikeDao;
    constructor(app: Express, tuitDao: ITuitDao, bookmarksDao: BookmarkDao, likeDao: LikeDao, userDao: IUserDao) {
        this.app = app;
        this.tuitDao = tuitDao;
        this.userDao = userDao;
        this.tuitDao = tuitDao;
        this.bookmarkDao = bookmarksDao;
        this.likeDao = likeDao;
        this.app.get('/api/tuits', this.findAllTuits);
        this.app.get('/api/tuits/:tuitid', this.findTuitById);
        this.app.get('/api/users/:uid/tuits', this.findTuitsByUser);
        this.app.post('/api/users/:uid/tuits', this.createTuitByUser);
        this.app.put('/api/tuits/:tuitid', this.updateTuit);
        this.app.delete('/api/tuits/:tuitid', this.deleteTuit);
        this.app.delete("/api/tuits/:uid/delete", this.deleteTuitByUserId);
    }

    findAllTuits = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuits = await this.tuitDao.findAllTuits();
        res.json(tuits);
    }
    findTuitById = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuit = await this.tuitDao.findTuitById(req.params.tuitid);
        res.json(tuit);
    }
    updateTuit = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {

        const tuit = await this.tuitDao.updateTuit(req.params.tuitid, req.body);
        res.json(tuit);
    }
    deleteTuit = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {


        const userDeletingId = "63858a59bffdb02c1ec4cfca"; //req.session['profile']._id
        const userDeletingObj = await this.userDao.findUserById(userDeletingId);
        const tuitToBeDeleted = await this.tuitDao.findTuitById(req.params.tuitid);
        const tuitPostedBy = tuitToBeDeleted?.postedBy?._id;

        if (userDeletingObj && tuitPostedBy) {
            if (userDeletingObj.admin || userDeletingId === tuitPostedBy) {


                //Remove all the Bookmark entries
                const bookmarks = await this.bookmarkDao.findAllTuitsBookmarkedByUser(tuitPostedBy);



                for (let i = 0; i < bookmarks.length; i++) {
                    await this.bookmarkDao.userUnbookmarksTuit(bookmarks[i].bookmarkedTuit._id, bookmarks[i].bookmarkedBy._id);
                }



                //Get All the tuits
                const tuits = await this.tuitDao.findTuitsByUser(tuitPostedBy);


                //Remove Likes
                for (let i = 0; i < tuits.length; i++) {
                    await this.likeDao.userUnlikesTuitByTuit(tuits[i]._id);
                }

                await this.likeDao.userUnlikesTuitByUser(tuitPostedBy);


                //Remove all the tuits by user
                const tuit = await this.tuitDao.deleteTuitByUserId(tuitPostedBy);



                res.json(tuit);


            }
            else {
                res.sendStatus(403);
            }

        }
        else {
            res.sendStatus(404);
        }
    }
    /**
     * @param {Request} req Represents request from client, including path
     * parameter uid identifying the primary key of the dummy user's tuit to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a tuit was successful or not
     */
    deleteTuitByUserId = async (req: Request, res: Response) => {
        const result = await this.tuitDao.deleteTuitByUserId(req.params.uid);
        res.json(result);
    }
    createTuitByUser = async (req: Request, res: Response) => {
        let userId = req.params.uid === "me" && req.session['profile'] ?
            req.session['profile']._id :
            req.params.uid;
        const tuit = await this.tuitDao.createTuit(userId, req.body);
        res.json(tuit);
    }

    findTuitsByUser = async (req: Request, res: Response) => {
        let userId = req.params.uid === "me" && req.session['profile'] ?
            req.session['profile']._id :
            req.params.uid;

        const tuit = await this.tuitDao.findTuitsByUser(userId);
        res.json(tuit);
    }
}