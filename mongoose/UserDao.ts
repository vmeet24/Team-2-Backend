/**
 * @file Implements DAO managing data storage of users. Uses mongoose UserModel
 * to integrate with MongoDB
 */

import IUserDao from "../interfaces/IUserDao";
import User from "../models/User";
import UserModel from "./UserModel";

/**
 * @class UserDao Implements Data Access Object managing data storage
 * of Users
 * @implements {IUserDao} IUserDao
 */
export default class UserDao implements IUserDao {

    /**
     * Uses UserModel to retrieve all user documents from users collection
     * @returns Promise To be notified when the users are retrieved from
     * database
     */
    async findAllUsers(): Promise<User[]> {
        return UserModel.find();
    }

    /**
    * Uses UserModel to retrieve single user document from users collection
    * @param {string} uid User's primary key
    * @returns Promise To be notified when user is retrieved from the database
    */
    async findUserById(uid: string): Promise<User | null> {
        return UserModel.findById(uid);
    }

    /**
     * Inserts user instance into the database
     * @param {User} user Instance to be inserted into the database
     * @returns Promise To be notified when user is inserted into the database
     */
    async createUser(user: User): Promise<User> {
        return UserModel.create(user);
    }

    /**
    * Updates user with new values in database
    * @param {string} uid Primary key of user to be modified
    * @param {User} user User object containing properties and their new values
    * @returns Promise To be notified when user is updated in the database
    */
    async updateUser(uid: string, user: User): Promise<any> {
        return UserModel.updateOne({ _id: uid }, { $set: user });
    }

    /**
     * Removes user from the database.
     * @param {string} uid Primary key of user to be removed
     * @returns Promise To be notified when user is removed from the database
     */
    async deleteUser(uid: string): Promise<any> {
        return UserModel.deleteOne({ _id: uid });
    }

    /**
     * Removes user with the given username from the database. Useful for testing
     * @returns Promise To be notified when the user with given username are removed from the
     * database
     */
    async deleteUsersByUsername(username: string): Promise<any> {
        return UserModel.deleteMany({ username });
    }
}