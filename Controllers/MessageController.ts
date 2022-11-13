/**
 * @file Controller RESTful Web service API for messages resource
 */
import { Express, Request, Response } from "express";
import IMessageController from "../interfaces/IMessageController";
import IMessageDao from "../interfaces/IMessageDao";

/**
 * @class MessageController Implements RESTful Web service API for messages resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/messages to retrieve all messages sent by a user
 *     </li>
 *     <li>GET /api/users/:uid/messages_received to retrieve all messages received by a user
 *     </li>
 *     <li>POST /api/users/:source_uid/messages/:target_uid to record that a user sent a message
 *     </li>
 *     <li>DELETE /api/messages/:mid to remove a particular message instance
 *     </li>
 * </ul>
 * @property {IMessageDao} messageDao DAO implementing messages CRUD operations
 * @property {Express} app Express instance to declare the RESTful Web service
 * RESTful Web service API
 */
export default class MessageController implements IMessageController {
    private messageDao: IMessageDao;
    private app: Express;
    /**
     * Creates controller instance
     * @param {IMessageDao} messageDao DAO implementing messages CRUD operations
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    constructor(app: Express, messageDao: IMessageDao) {
        this.app = app;
        this.messageDao = messageDao;
        app.get("/api/users/:uid/messages", this.findAllMessagesSentByUser);
        app.get("/api/users/:uid/messages_received", this.findAllMessagesSentToUser);
        app.post("/api/users/:source_uid/messages/:target_uid", this.userSendsMessage);
        app.delete("/api/messages/:mid", this.userDeletesOneMessage);
    }

    /**
    * Retrieves all messages sent by a user from the database
    * @param {Request} req Represents request from client, including the path
    * parameter uid representing user sent the messages
    * @param {Response} res Represents response to client, including the
    * body formatted as JSON arrays containing the message objects
    */
    findAllMessagesSentByUser = async (req: Request, res: Response) => {
        const messages = await this.messageDao.findAllMessagesSentByUser(req.params.uid);
        res.json(messages);
    }

    /**
     * Retrieves all messages sent to a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing user sent the messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the messages user received
     */
    findAllMessagesSentToUser = async (req: Request, res: Response) => {
        const messages = await this.messageDao.findAllMessagesSentToUser(req.params.uid);
        res.json(messages);
    }

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters source_uid and target_id representing the source user sent
     * the message to target_user and body containing the JSON object for the new
     * message to be inserted in the database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmarks that was inserted in the
     * database
     */
    userSendsMessage = async (req: Request, res: Response) => {
        const message = await this.messageDao.userSendsMessage(req.params.source_uid, req.params.target_uid, req.body.message);
        res.json(message);
    }

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters mid representing the id of message to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting the message was successful or not
     */
    userDeletesOneMessage = async (req: Request, res: Response) => {
        const message = await this.messageDao.userDeletesOneMessage(req.params.mid);
        res.json(message);
    }
}