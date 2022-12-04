/**
 * @file The Tuit controller handles mapping our RESTful API to our DAO layer for remote database
 * access of the Tuits collection.
 */

import { Request, Response, Express } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IBookmarkDao from "../interfaces/IBookmarkDao";
import ILikeDao from "../interfaces/ILikeDao";
import ITuitController from "../interfaces/ITuitController";
import ITuitDao from "../interfaces/ITuitDao";
import IUserDao from "../interfaces/IUserDao";

/**
 * The implementation of our Tuits controller interface which maps URIs to the appropriate DAO calls 
 * to access data in our remote database.
 * @param {Express} app The Express application our backend uses to send/receive HTTP requests
 * @param {ITuitDao} tuitDao The DAO instance used to interact with the tuits collection
 * @param {IUserDao} userDao The DAO instance used to interact with the users collection
 * @param {IBookmarkDao} bookmarksDao The DAO instance used to interact with the bookmarks collection
 * @param {ILikeDao} likeDao The DAO instance used to interact with the likes collection
 * @class TuitController
 * @implements ITuitController
 */
export default class TuitController implements ITuitController {
    private app: Express;
    private tuitDao: ITuitDao;
    private userDao: IUserDao;
    private bookmarkDao: IBookmarkDao;
    private likeDao: ILikeDao;

    /**
     * The constructor for the TuitController which sets up the supported URIs with the Express app
     * and returns a new TuitController object.
     * @param {Express} app
     * @param {ITuitDao} tuitDao The DAO instance used to interact with the tuits collection
     * @param {IUserDao} userDao The DAO instance used to interact with the users collection
     * @param {IBookmarkDao} bookmarksDao The DAO instance used to interact with the bookmarks collection
     * @param {ILikeDao} likeDaoThe DAO instance used to interact with the likes collection
     */
    constructor(app: Express, tuitDao: ITuitDao, bookmarksDao: IBookmarkDao, likeDao: ILikeDao, userDao: IUserDao) {
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

    /**
     * Gets all the available tuits in the tuits collection and adds them as an array to the HTTP
     * response.
     * @param req The HTTP request object received by the controller
     * @param res The HTTP response object that will be sent back
     */
    findAllTuits = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuits = await this.tuitDao.findAllTuits();
        res.json(tuits);
    }

    /**
     * Gets a particular tuit by its unique id and adds it as a JSON-formatted object to the HTTP
     * response.
     * @param req The HTTP request object received by the controller
     * @param res The HTTP response object that will be sent back
     */
    findTuitById = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuit = await this.tuitDao.findTuitById(req.params.tuitid);
        res.json(tuit);
    }

    /**
     * Accepts a tuit object in the body and updates the tuit object stored in the remote DB with
     * the given fields. It also adds the success of the operation to the HTTP response.
     * @param req The HTTP request object received by the controller
     * @param res The HTTP response object that will be sent back
     */
    updateTuit = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuit = await this.tuitDao.updateTuit(req.params.tuitid, req.body);
        res.json(tuit);
    }

    /**
     * Parses a Tuit ID from the request and deletes it as well as its dependencies (e.g., Likes, Bookmarks).
     * The result of the delete operation is added to the returned HTTP response.
     * @param req The HTTP request object received by the controller
     * @param res The HTTP response object that will be sent back
     */
    deleteTuit = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const userDeletingId = req.session['profile']._id
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

    /**
     * Creates a tuit with the currently logged in user as the author and returns the newly 
     * created tuit in the Response object.
     * @param {Request} req The HTTP request object received by the controller
     * @param {Response} res The HTTP response object that will be sent back
     */
    createTuitByUser = async (req: Request, res: Response) => {
        let userId = req.params.uid === "me" && req.session['profile'] ?
            req.session['profile']._id :
            req.params.uid;
        const tuit = await this.tuitDao.createTuit(userId, req.body);
        res.json(tuit);
    }

    /**
     * Find all tuits posted by a given user and adds them in an array to the HTTP response object.
     * @param {Request} req The HTTP request object received by the controller
     * @param {Response} res The HTTP response object that will be sent back
     */
    findTuitsByUser = async (req: Request, res: Response) => {
        let userId = req.params.uid === "me" && req.session['profile'] ?
            req.session['profile']._id :
            req.params.uid;

        const tuit = await this.tuitDao.findTuitsByUser(userId);
        res.json(tuit);
    }
}