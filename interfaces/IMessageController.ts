/**
 * @file Declares controller RESTful API for Messages resource
 */
import { Request, Response } from "express";

export default interface IMessageController {
    findAllMessagesSentByUser(req: Request, res: Response): void;
    findAllMessagesSentToUser(req: Request, res: Response): void;
    userSendsMessage(req: Request, res: Response): void;
    userDeletesOneMessage(req: Request, res: Response): void;
};