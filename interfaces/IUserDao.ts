/**
 * @file Declares API for Bookmarks related data access object methods
 */

import User from "../models/User";

export default interface IUserDao {
    findAllUsers(): Promise<User[]>;
    findUserById(uid: string): Promise<User | null>;
    createUser(user: User): Promise<User>;
    updateUser(uid: string, user: User): Promise<any>;
    deleteUser(uid: string): Promise<any>;
    deleteUsersByUsername(username: string): Promise<any>;
    findUserByUsername(username: string): Promise<any>;
    findUsersByEmail(email: string): Promise<User[]>
    findUsersByUsername(username: string): Promise<User[]>
}