/**
 * @file Declares API for Bookmarks related data access object methods
 */
import Message from "../models/Message";

export default interface IMessageDao {
    findAllMessagesSentByUser(uid: string): Promise<Message[]>;
    findAllMessagesSentToUser(uid: string): Promise<Message[]>;
    userSendsMessage(source_uid: string, target_uid: string, message: Message): Promise<Message>;
    userDeletesOneMessage(mid: string): Promise<any>;
};