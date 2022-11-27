import { Request, Response, Express } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IUserController from "../interfaces/IUserController";
import IUserDao from "../interfaces/IUserDao";
import BookmarkDao from "../mongoose/BookmarkDao";
import FollowDao from "../mongoose/FollowDao";
import TuitDao from "../mongoose/TuitDao";

export default class UserController implements IUserController {
    private app: Express;
    private userDao: IUserDao;
    private followsDao: FollowDao;
    private tuitDao: TuitDao;
    private bookmarkDao: BookmarkDao;
    constructor(app: Express, userDao: IUserDao, followsDao: FollowDao, tuitDao: TuitDao, bookmarksDao: BookmarkDao) {
        this.app = app;
        this.userDao = userDao;
        this.followsDao = followsDao;
        this.tuitDao = tuitDao;
        this.bookmarkDao = bookmarksDao;
        this.app.get('/api/users', this.findAllUsers);
        this.app.get('/api/users/:userid', this.findUserById);
        this.app.post('/api/users', this.createUser);
        this.app.delete('/api/users/:userid', this.deleteUser);
        this.app.put('/api/users/:userid', this.updateUser);
        this.app.delete("/api/users/username/:username/delete", this.deleteUsersByUsername);
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

    findAllUsers = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const users = await this.userDao.findAllUsers();
        res.json(users);
    }
    findUserById = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const user = await this.userDao.findUserById(req.params.userid);
        res.json(user);
    }
    createUser = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const user = await this.userDao.createUser(req.body);
        res.json(user);
    }
    deleteUser = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const userDeletingId = req.session['profile']._id;
        const userDeletingObj = await this.userDao.findUserById(userDeletingId);
        const userToBeDeleted = req.params.userid;
        if (userDeletingObj) {
            if (userDeletingObj.admin || userDeletingId === userToBeDeleted) {
                const user = await this.userDao.deleteUser(userToBeDeleted);



                //Remove all the follow entries where user is being followed by other users
                const followedBy = await this.followsDao.findAllUsersThatUserIsFollowedBy(user._id);
                for (let i = 0; i < followedBy.length; i++) {
                    await this.followsDao.userUnFollowsAnotherUser(followedBy[i].userFollowing.toString(), followedBy[i].userFollowed.toString());
                }

                //Remove all the follow entries where user is following other users
                const following = await this.followsDao.findAllUsersThatUserIsFollowing(user._id);
                for (let i = 0; i < following.length; i++) {
                    await this.followsDao.userUnFollowsAnotherUser(following[i].userFollowing.toString(), following[i].userFollowed.toString());
                }


            

                res.json(user);



            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.sendStatus(403);
        }
    }

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