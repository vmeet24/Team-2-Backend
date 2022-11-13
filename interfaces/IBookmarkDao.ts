/**
 * @file Declares API for Bookmarks related data access object methods
 */

import Bookmark from "../models/Bookmark";
export default interface IBookmarkDao {
    findAllTuitsBookmarkedByUser(uid: string): Promise<Bookmark[]>;
    userBookmarksTuit(tid: string, uid: string): Promise<Bookmark>;
    userUnbookmarksTuit(tid: string, uid: string): Promise<any>;
};