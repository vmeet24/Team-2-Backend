/**
 * @file The User controller handles mapping our RESTful API to our DAO layer for remote database
 * access of the Users collection.
 */

import { Request, Response, Express } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IUserController from "../interfaces/IUserController";
import IUserDao from "../interfaces/IUserDao";
import Like from "../models/Like";
import BookmarkDao from "../mongoose/BookmarkDao";
import FollowDao from "../mongoose/FollowDao";
import LikeDao from "../mongoose/LikeDao";
import TuitDao from "../mongoose/TuitDao";

/**
 * The implementation of our Users controller interface which maps URIs to the appropriate DAO calls 
 * to access data in our remote database.
 * @param {Express} app The Express application our backend uses to send/receive HTTP requests
 * @param {TuitDao} tuitDao The DAO instance used to interact with the tuits collection
 * @param {IUserDao} userDao The DAO instance used to interact with the users collection
 * @param {BookmarkDao} bookmarksDao The DAO instance used to interact with the bookmarks collection
 * @param {LikeDao} likeDao The DAO instance used to interact with the likes collection
 * @param {FollowDao} followsDao The DAO instance used to interact with the follows collection
 * @class UserController
 * @implements IUserController
 */
export default class UserController implements IUserController {
    private app: Express;
    private userDao: IUserDao;
    private followsDao: FollowDao;
    private tuitDao: TuitDao;
    private bookmarkDao: BookmarkDao;
    private likeDao: LikeDao;

    /**
     * The constructor for the UserController which sets up the supported URIs with the Express app
     * and returns a new UserController object.
     * @param {Express} app The Express application our backend uses to send/receive HTTP requests
     * @param {IUserDao} userDao The DAO instance used to interact with the users collection
     * @param {FollowDao} followsDao The DAO instance used to interact with the follows collection
     * @param {TuitDao} tuitDao The DAO instance used to interact with the tuits collection
     * @param {BookmarkDao} bookmarksDao The DAO instance used to interact with the bookmarks collection
     * @param {LikeDao} likeDao The DAO instance used to interact with the likes collection
     */
    constructor(app: Express, userDao: IUserDao, followsDao: FollowDao, tuitDao: TuitDao, bookmarksDao: BookmarkDao, likeDao: LikeDao) {
        this.app = app;
        this.userDao = userDao;
        this.followsDao = followsDao;
        this.tuitDao = tuitDao;
        this.bookmarkDao = bookmarksDao;
        this.likeDao = likeDao;
        
        this.app.get('/api/users', this.findAllUsers);
        this.app.get('/api/users/search', this.searchUserByUsernameOrEmail);
        this.app.get('/api/users/:userid', this.findUserById);
        this.app.post('/api/users', this.createUser);
        this.app.delete('/api/users/:userid', this.deleteUser);
        this.app.put('/api/users/:userid', this.updateUser);
        this.app.delete("/api/users/username/:username/delete", this.deleteUsersByUsername);
    }

    /**
     * Retrieves users from the database which matches with the given query parameters 
     * i.e. email or username and returns an array of users.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    searchUserByUsernameOrEmail = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
        if (req?.session['profile']) {
            const user = req?.session['profile'];
            if (user.admin) {
                if (req.query.username) {
                    const result = await this.userDao.findUsersByUsername(req.query.username as string);
                    res.json(result);
                } else if (req.query.email) {
                    const result = await this.userDao.findUsersByEmail(req.query.email as string);
                    res.json(result);
                } else {
                    const users = await this.userDao.findAllUsers();
                    res.json(users);
                }
            } else {
                res.status(403).send("Sorry, only admin can access all the users");
            }
        } else {
            res.status(400).send("Sorry, session failed, try to login again!");
        }
    }

    /**
     * Checks a given request for the keyword "me" and returns the id of the currently signed
     * in user. Otherwise returns the uid from the request iself.
     * @param {Request} req The given HTTP request object one of our endpoints receives
     * @returns {string} The ID of the user making the request
     */
    parseUserId = (req: Request) => {
        const profile = req.session['profile'];
        return req.params.userid === "me" && profile ? profile._id : req.params.userid;
    }

    /**
     * Retrieves all users from the database and returns an array of users.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsers = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        if (req?.session['profile']) {
            const user = req?.session['profile'];
            if (user.admin) {
                const users = await this.userDao.findAllUsers();
                res.json(users);
            } else {
                res.status(403).send("Sorry, only admin can access all the users");
            }
        } else {
            res.status(400).send("Sorry, session failed, try to login again!");
        }
    }

    /**
     * Finds a user by its unique ID and adds a JSON-formatted copy of the user object to the returned
     * HTTP response object.
     * @param req The HTTP request object received by the controller
     * @param res The HTTP response object that will be sent back
     */
    findUserById = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const user = await this.userDao.findUserById(req.params.userid);
        res.json(user);
    }
    
    /**
     * Creates a new user in the users collection and adds a JSON-formatted version of the user to
     * the returned HTTP response.
     * @param req The HTTP request object received by the controller
     * @param res The HTTP response object that will be sent back
     */
    createUser = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const user = await this.userDao.createUser(req.body);
        res.json(user);
    }

    /**
     * Deletes a user and all of its dependencies (follows, bookmarks, etc.) and adds the results
     * of the delete request to the return HTTP response.
     * @param req The HTTP request object received by the controller
     * @param res The HTTP response object that will be sent back
     */
    deleteUser = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const userDeletingId = req.session['profile']._id
        const userDeletingObj = await this.userDao.findUserById(userDeletingId);
        const userToBeDeleted = req.params.userid;

        if (userDeletingObj) {
            if (userDeletingObj.admin || userDeletingId === userToBeDeleted) {
                //Remove all the follow entries where user is being followed by other users
                const followedBy = await this.followsDao.findAllUsersThatUserIsFollowedBy(userToBeDeleted);

                for (let i = 0; i < followedBy.length; i++) {
                    await this.followsDao.userUnFollowsAnotherUser(followedBy[i].userFollowing._id, followedBy[i].userFollowed._id);
                }

                //Remove all the follow entries where user is following other users
                const following = await this.followsDao.findAllUsersThatUserIsFollowing(userToBeDeleted);

                for (let i = 0; i < following.length; i++) {
                    await this.followsDao.userUnFollowsAnotherUser(following[i].userFollowing._id, following[i].userFollowed._id);
                }

                //Remove all the Bookmark entries
                const bookmarks = await this.bookmarkDao.findAllTuitsBookmarkedByUser(userToBeDeleted);

                for (let i = 0; i < bookmarks.length; i++) {
                    await this.bookmarkDao.userUnbookmarksTuit(bookmarks[i].bookmarkedTuit._id, bookmarks[i].bookmarkedBy._id);
                }

                //Get All the tuits
                const tuits = await this.tuitDao.findTuitsByUser(userToBeDeleted);

                //Remove Likes
                for (let i = 0; i < tuits.length; i++) {
                    await this.likeDao.userUnlikesTuitByTuit(tuits[i]._id);
                }

                await this.likeDao.userUnlikesTuitByUser(userToBeDeleted);

                //Remove all the tuits by user
                await this.tuitDao.deleteTuitByUserId(userToBeDeleted);

                const user = await this.userDao.deleteUser(userToBeDeleted);
                res.json(user);
            }
            else {
                res.sendStatus(404);
            }
        }
        else {
            res.sendStatus(403);
        }
    }

    /**
     * Parses the HTTP request body fields, updates the matching user object with the given field
     * values, and adds a JSON-formatted result of the update operation to the returned HTTP response. 
     * @param req The HTTP request object received by the controller
     * @param res The HTTP response object that will be sent back
     */
    updateUser = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const users = await this.userDao.updateUser(req.params.userid, req.body);
        res.json(users);
    }
    
    /**
    * Removes user instance with the given username from the database.
    * @param {Request} req Represents request from client
    * @param {Response} res Represents response to client, including status
    * on whether deleting user was successful or not
    */
    deleteUsersByUsername = async (req: Request, res: Response) => {
        const result = await this.userDao.deleteUsersByUsername(req.params.username);
        res.json(result);
    }
}