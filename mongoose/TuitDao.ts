/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB
 */

import ITuitDao from "../interfaces/ITuitDao";
import Tuit from "../models/Tuit";
import TuitModel from "./TuitModel";

/**
 * @class TuitDao Implements Data Access Object managing data storage
 * of Tuits
 * @implements {ITuitDao} ITuitDao
 */
export default class TuitDao implements ITuitDao {

    /**
     * Uses TuitModel to retrieve all tuit documents from tuits collection
     * @returns Promise To be notified when the tuits are retrieved from
     * database
     */
    async findAllTuits(): Promise<Tuit[]> {
        return await TuitModel.find();
    }

    /**
     * Uses TuitModel to retrieve single tuit document from tuits collection using the uid
     * @param {string} uid User's primary key
     * @returns Promise To be notified when tuit is retrieved from the database
     */
    async findTuitsByUser(uid: string): Promise<Tuit[]> {
        return await TuitModel.find({ postedBy: uid }, { postedBy: 0 }).populate('postedBy').exec();
    }

    /**
    * Uses TuitModel to retrieve single tuit document from tuits collection
    * @param {string} tid User's primary key
    * @returns Promise To be notified when tuit is retrieved from the database
    */
    async findTuitById(tid: string): Promise<Tuit | null> {
        return await TuitModel.findById(tid);
    }

    /**
     * Inserts tuit instance into the database under user context
     * @param {Tuit} tuit Instance to be inserted into the database
     * @returns Promise To be notified when tuit is inserted into the database
     */
    async createTuit(userid: string, tuit: Tuit): Promise<Tuit> {
        return await TuitModel.create({ ...tuit, postedBy: userid });
    }

    /**
     * Updates tuit with new values in database
     * @param {string} tid Primary key of tuit to be modified
     * @param {Tuit} tuit object containing properties and their new values
     * @returns Promise To be notified when tuit is updated in the database
     */
    async updateTuit(tid: string, tuit: Tuit): Promise<any> {
        return await TuitModel.updateOne({ _id: tid }, { $set: tuit });
    }

    /**
    * Removes tuit from the database.
    * @param {string} tid Primary key of tuit to be removed
    * @returns Promise To be notified when tuit is removed from the database
    */
    async deleteTuit(tid: string): Promise<any> {
        return await TuitModel.deleteOne({ _id: tid });
    }

    /**
     * Removes tuit from the database. Used for testing
     * @param {string} uid Primary key of the dummy user whose tuit to be removed
     * @returns Promise To be notified when tuit is removed from the database
     */
    async deleteTuitByUserId(uid: string): Promise<any> {
        return await TuitModel.deleteMany({ postedBy: uid });
    }

}