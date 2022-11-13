/**
 * @file Implements DAO managing data storage of follows. Uses mongoose FollowModel
 * to integrate with MongoDB
 */

import IFollowDao from "../interfaces/IFollowDao";
import Follow from "../models/Follow";
import FollowModel from "./FollowModel";


/**
 * @class FollowDao Implements Data Access Object managing data storage
 * of Follows
 * @implements {IFollowDao} IFollowDao
 */
export default class FollowDao implements IFollowDao {

    /**
     * Uses FollowModel to retrieve all users followed by a user from follows collection
     * @param {string} uid actor user's primary key
     * @returns Promise when the user data is available from the database
     */
    async findAllUsersThatUserIsFollowing(uid: string): Promise<Follow[]> {
        return FollowModel.find({ userFollowing: uid }, { userFollowing: 0 }).populate("userFollowed").exec();
    }

    /**
     * Uses FollowModel to retrieve all users following a user from follows collection
     * @param {string} uid actor user's primary key
     * @returns Promise when the user data is available from the database
     */
    async findAllUsersThatUserIsFollowedBy(uid: string): Promise<Follow[]> {
        return FollowModel.find({ userFollowed: uid }, { userFollowed: 0 }).populate("userFollowing").exec();
    }

    /**
     * Inserts follow instance into the database under user context shows one user follows another
     * @param {string} source_uid source/actor user's primary key
     * @param {string} target_uid target user's primary key
     * @returns Promise when the follow data is inserted into the database
     */
    async userFollowsAnotherUser(source_uid: string, target_uid: string): Promise<Follow> {
        return FollowModel.create({ userFollowing: source_uid, userFollowed: target_uid });
    }

    /**
    * Removes follow instance from the database
    * @param {string} source_uid source/actor user's primary key
    * @param {string} target_uid target user's primary key
    * @returns Promise when the follow data is removed from the database
    */
    async userUnFollowsAnotherUser(source_uid: string, target_uid: string): Promise<any> {
        return FollowModel.deleteOne({ userFollowing: source_uid, userFollowed: target_uid });
    }
}