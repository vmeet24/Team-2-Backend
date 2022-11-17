/**
 * @file Declares controller RESTful API for Tuits resource
 */

import { Request, Response } from "express";

export default interface ITuitController {
    findAllTuits(req: Request, res: Response): void;
    findTuitById(req: Request, res: Response): void;
    findTuitsByUser(req: Request, res: Response): void;
    createTuitByUser(req: Request, res: Response): void;
    updateTuit(req: Request, res: Response): void;
    deleteTuit(req: Request, res: Response): void;
    deleteTuitByUserId(req: Request, res: Response): void;
}
