/**
 * @file Controller RESTful Web service API for likes resource
 */
import { Express, Request, Response } from "express";
import ILikeController from "../interfaces/ILikeController";
import ILikeDao from "../interfaces/ILikeDao";

/**
 * @class TuitController Implements RESTful Web service API for likes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/likes to retrieve all the tuits liked by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/likes to retrieve all users that liked a tuit
 *     </li>
 *     <li>POST /api/users/:uid/likes/:tid to record that a user likes a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/unlikes/:tid to record that a user
 *     no londer likes a tuit</li>
 * </ul>
 * @property {ILikeDao} likeDao DAO implementing likes CRUD operations
 * @property {Express} app Express instance to declare the RESTful Web service
 * RESTful Web service API
 */
export default class LikeController implements ILikeController {
    private likeDao: ILikeDao;
    private app: Express;
    /**
     * Creates controller instance
     * @param {ILikeDao} likeDao DAO implementing likes CRUD operations
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    constructor(app: Express, likeDao: ILikeDao) {
        this.app = app;
        this.likeDao = likeDao;
        this.app.get("/api/users/:uid/likes", this.findAllTuitsLikedByUser);
        this.app.get("/api/tuits/:tid/likes", this.findAllUsersThatLikedTuit);
        this.app.post("/api/users/:uid/likes/:tid", this.userLikesTuit);
        this.app.delete("/api/users/:uid/unlikes/:tid", this.userUnlikesTuit);
    }

    /**
     * Retrieves all users that liked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatLikedTuit = async (req: Request, res: Response) => {
        const users = await this.likeDao.findAllUsersThatLikedTuit(req.params.tid)
        res.json(users);
    }


    /**
     * Retrieves all tuits liked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user liked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
    findAllTuitsLikedByUser = async (req: Request, res: Response) => {
        const tuits = await this.likeDao.findAllTuitsLikedByUser(req.params.uid)
        res.json(tuits);
    }


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new likes that was inserted in the
     * database
     */
    userLikesTuit = async (req: Request, res: Response) => {
        const result = this.likeDao.userLikesTuit(req.params.uid, req.params.tid)
        res.json(result);
    }


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unliking
     * the tuit and the tuit being unliked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the like was successful or not
     */
    userUnlikesTuit = async (req: Request, res: Response) => {
        const status = await this.likeDao.userUnlikesTuit(req.params.uid, req.params.tid)
        res.send(status);
    }
};