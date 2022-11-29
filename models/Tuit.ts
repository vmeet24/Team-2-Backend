/**
 * @file Model class for Tuit
 */

import { Mongoose, Document } from "mongoose";
import User from "./User";

export default interface Tuit extends Document {
    tuit: string;
    postedOn: Date;
    postedBy: User;

}