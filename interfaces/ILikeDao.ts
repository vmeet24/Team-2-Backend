/**
 * @file Declares API for Follows related data access object methods
 */

import Like from "../models/Like";

export default interface ILikeDao {
    findAllUsersThatLikedTuit(tid: string): Promise<Like[]>;
    findAllTuitsLikedByUser(uid: string): Promise<Like[]>;
    userUnlikesTuit(tid: string, uid: string): Promise<any>;
    userLikesTuit(tid: string, uid: string): Promise<Like>;
};