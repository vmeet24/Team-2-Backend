/**
 * @file Implements DAO managing data storage of messages. Uses mongoose MessageModel
 * to integrate with MongoDB
 */

import IMessageDao from "../interfaces/IMessageDao";
import Message from "../models/Message";
import MessageModel from "./MessageModel";

/**
 * @class MessageDao Implements Data Access Object managing data storage
 * of Messages
 * @implements {IMessageDao} IMessageDao
 */
export default class MessageDao implements IMessageDao {

    /**
    * Uses MessageModel to retrieve all message documents from messages collection sent by a user
    * @param {string} uid User's primary key
    * @returns Promise To be notified when the messages are retrieved from database
    */
    async findAllMessagesSentByUser(uid: string): Promise<Message[]> {
        return MessageModel.find({ from: uid });
    }

    /**
    * Uses MessageModel to retrieve all message documents from messages collection sent to a user
    * @param {string} uid User's primary key
    * @returns Promise To be notified when the messages are retrieved from database
    */
    async findAllMessagesSentToUser(uid: string): Promise<Message[]> {
        return MessageModel.find({ to: uid });
    }

    /**
     * Inserts message instance into the database under user context
     * @param {string} source_uid source/actor user's primary key
     * @param {string} target_uid target user's primary key
     * @param {Message} message Instance to be inserted into the database
     * @returns Promise To be notified when message is inserted into the database
     */
    async userSendsMessage(source_uid: string, target_uid: string, message: Message): Promise<Message> {
        return MessageModel.create({ from: source_uid, to: target_uid, message });
    }

    /**
    * Removes message from the database.
    * @param {string} mid Primary key of message to be removed
    * @returns Promise To be notified when message is removed from the database
    */
    async userDeletesOneMessage(mid: string): Promise<any> {
        return MessageModel.deleteOne({ _id: mid });
    }
}