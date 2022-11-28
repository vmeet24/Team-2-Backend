import { Request, Response, Express } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IUserController from "../interfaces/IUserController";
import IUserDao from "../interfaces/IUserDao";

export default class UserController implements IUserController {
    private app: Express;
    private userDao: IUserDao;
    constructor(app: Express, userDao: IUserDao) {
        this.app = app;
        this.userDao = userDao;
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
        }else{
            res.status(400).send("Sorry, session failed, try to login again!");
        }
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
        const user = await this.userDao.deleteUser(req.params.userid);
        res.json(user);
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