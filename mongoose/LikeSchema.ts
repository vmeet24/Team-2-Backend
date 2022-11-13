import mongoose, { Schema } from "mongoose";
import Like from "../models/Like";

/**
 * @typedef Like Like represents the like relation between a user and a tuit
 * @property {ObjectId} tuit The id of the tuit like by user
 * @property {ObjectId} likedBy The id of the user
 */
const LikeSchema = new mongoose.Schema<Like>({
    tuit: { type: Schema.Types.ObjectId, ref: "TuitModel" },
    likedBy: { type: Schema.Types.ObjectId, ref: "UserModel" },
}, { collection: "likes" })

export default LikeSchema;