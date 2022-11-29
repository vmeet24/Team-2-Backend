/**
 * @file Model class for Tuit
 */

import { Mongoose, Document } from "mongoose";
import User from "./User";

export default class Tuit extends Document {
    private tuit: string = '';
    private postedOn: Date = new Date();
    private postedBy: User | null = null;

}