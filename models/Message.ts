/**
 * @file Model interface class for Message
 */

import User from "./User";

export default interface Message {
    message: String,
    to: User,
    from: User,
    sentOn: Date
}