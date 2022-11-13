/**
 * @file Declares RESTful API for Bookmarks resource
 */

import { Request, Response } from "express";

export default interface IBookmarkController {
    findAllTuitsBookmarkedByUser(req: Request, res: Response): void;
    userBookmarksTuit(req: Request, res: Response): void;
    userUnbookmarksTuit(req: Request, res: Response): void;
};