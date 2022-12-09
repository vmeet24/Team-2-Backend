/**
 * @file Implements DAO managing data storage of bookmarks. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */

import IBookmarkDao from "../interfaces/IBookmarkDao";
import Bookmark from "../models/Bookmark";
import BookmarkModel from "./BookmarkModel";

export default class BookmarkDao implements IBookmarkDao {
     /**
     * Retrieve bookmark record of a specific user for a specific tuit.
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when the bookmarks are retrieved from database
     */
    async findTuitBookmarkedByUser(uid: string, tid: string): Promise<Bookmark | null> {
        return BookmarkModel.findOne({ bookmarkedBy: uid, bookmarkedTuit: tid }).populate("bookmarkedTuit").exec();
    }



    /**
     * Retrieve all tuits from bookmarks collection bookmarked by a user
     * @param {string} uid User's primary key
     * @returns Promise To be notified when the bookmarks are retrieved from database
     */
    async findAllTuitsBookmarkedByUser(uid: string): Promise<Bookmark[]> {
        return BookmarkModel.find({ bookmarkedBy: uid }).populate("bookmarkedTuit").exec();
    }

    /**
     * Inserts bookmark instance into the database
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when bookmark is inserted into the database
     */
    async userBookmarksTuit(tid: string, uid: string): Promise<Bookmark> {
        return BookmarkModel.create({ bookmarkedBy: uid, bookmarkedTuit: tid });
    }

    /**
     * Remove bookmark instance from the database
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when bookmark is removed from the database
     */
    async userUnbookmarksTuit(tid: string, uid: string): Promise<any> {
        return BookmarkModel.deleteOne({ bookmarkedBy: uid, bookmarkedTuit: tid });
    }
}