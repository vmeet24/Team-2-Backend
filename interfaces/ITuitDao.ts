/**
 * @file Declares API for Tuit related data access object methods
 */

import Tuit from "../models/Tuit";

export default interface ITuitDao {
    findAllTuits(): Promise<Tuit[]>;
    findTuitsByUser(uid: string): Promise<Tuit[]>;
    findTuitById(tid: string): Promise<Tuit | null>;
    createTuit(userid: string, tuit: Tuit): Promise<Tuit>;
    updateTuit(tid: string, tuit: Tuit): Promise<any>;
    deleteTuit(tid: string): Promise<any>;
    searchByTuit(tuit: string): Promise<any>;
    deleteTuitByUserId(uid: string): Promise<any>;
}
