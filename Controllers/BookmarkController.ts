import { Express, Request, Response } from "express";
import IBookmarkController from "../interfaces/IBookmarkController";
import IBookmarkDao from "../interfaces/IBookmarkDao";

/**
 * @class BookmarkController Implements RESTful Web service API for bookmarks resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/bookmarks to retrieve all the tuits bookmarked by a user
 *     </li>
 *     <li>POST /api/users/:uid/bookmarks/:tid to record that a user bookmarks a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/bookmarks/:tid to record that a user
 *     no longer bookmarks a tuit</li>
 * </ul>
 * @property {IBookmarkDao} IBookmarkDao Singleton DAO implementing bookmarks CRUD operations
 * @property {Express} app Express instance to declare the RESTful Web service
 * RESTful Web service API
 */
export default class BookmarkController implements IBookmarkController {
    private bookmarkDao: IBookmarkDao;
    private app: Express;

    /**
      * Creates controller instance
      * @param {Express} app Express instance to declare the RESTful Web service
      * @param {IBookmarkDao} IBookmarkDao Singleton DAO implementing bookmarks CRUD operations
      * API
      * @return BookmarkController
      */
    constructor(app: Express, bookmarkDao: IBookmarkDao) {
        this.app = app;
        this.bookmarkDao = bookmarkDao;
        this.app.get("/api/users/:uid/bookmarks", this.findAllTuitsBookmarkedByUser);
        this.app.post("/api/users/:uid/bookmarks/:tid", this.userBookmarksTuit);
        this.app.delete("/api/users/:uid/bookmarks/:tid", this.userUnbookmarksTuit);
    }

    /**
     * Checks a given request for the keyword "me" and returns the id of the currently signed 
     * in user. Otherwise returns the uid from the request iself.
     * @param {Request} req The given HTTP request object one of our endpoints receives
     * @returns {string} The ID of the user making the request
     */
    parseUserId = (req: Request) => {
        const profile = req.session['profile'];
        return req.params.uid === "me" && profile ? profile._id : req.params.uid;
    }

    /**
     * Retrieves all tuits bookmarked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user bookmarked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were bookmarked
     */
    findAllTuitsBookmarkedByUser = async (req: Request, res: Response) => {
        const uid = this.parseUserId(req);
        const tuits = await this.bookmarkDao.findAllTuitsBookmarkedByUser(uid);
        res.json(tuits);
    }

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is bookmarking the tuit
     * and the tuit being bookmarked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmarks that was inserted in the
     * database
     */
    userBookmarksTuit = async (req: Request, res: Response) => {
        const uid = this.parseUserId(req);
        const tuit = await this.bookmarkDao.userBookmarksTuit(req.params.tid, uid);
        res.json(tuit);
    }

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unbookmarking
     * the tuit and the tuit being bookmarked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the bookmark was successful or not
     */
    userUnbookmarksTuit = async (req: Request, res: Response) => {
        const uid = this.parseUserId(req);
        const result = await this.bookmarkDao.userUnbookmarksTuit(req.params.tid, uid);
        res.json(result);
    }
}