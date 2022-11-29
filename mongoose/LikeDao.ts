/**
 * @file Implements DAO managing data storage of likes. Uses mongoose LikeModel
 * to integrate with MongoDB
 */

import ILikeDao from "../interfaces/ILikeDao";
import LikeModel from "../mongoose/LikeModel";
import Like from "../models/Like";

/**
 * @class LikeDao Implements Data Access Object managing data storage
 * of Likes
 * @implements {ILikeDao} ILikeDao
 */
export default class LikeDao implements ILikeDao {

    /**
     * Retrieve all users that liked the given tuit
     * @param {string} tid Tuit's Id
     * @returns Promise when the user data is available from the database
     */
    async findAllUsersThatLikedTuit(tid: string): Promise<Like[]> {
        return LikeModel
            .find({ tuit: tid })
            .populate("likedBy")
            .exec();
    }

    /**
     * Retrieve all tuits that liked by the given user
     * @param {string} uid User's Id
     * @returns Promise when the tuits data is available from the database
     */
    async findAllTuitsLikedByUser(uid: string): Promise<Like[]> {
        return LikeModel
            .find({ likedBy: uid })
            .populate({
                path: "tuit",         // replace tuit reference with actual document
                populate: {
                    path: "postedBy" // replace tuit's postedBy reference with actual user document
                }
            })
            .exec();
    }

    /**
     * Inserts like object into the database
     * @param {string} uid User's Id
     * @param {string} tid Tuit's Id
     * @returns Promise when the like data is inserted into the database
     */
    async userLikesTuit(uid: string, tid: string): Promise<Like> {
        return LikeModel.create({ tuit: tid, likedBy: uid });
    }

    /**
     * Remove like object from the database
     * @param {string} uid User's Id
     * @param {string} tid Tuit's Id
     * @returns Promise when the like data is removed from the database
     */
    async userUnlikesTuit(uid: string, tid: string): Promise<any> {
        return LikeModel.deleteOne({ tuit: tid, likedBy: uid });
    }

    async userUnlikesTuitByUser(uid: string): Promise<any> {
        return await LikeModel.deleteMany({ likedBy: uid });
    }

    async userUnlikesTuitByTuit(tid: string): Promise<any> {
        return await LikeModel.deleteMany({ tuit: tid });
    }
}