/**
 * @file Implements mongoose model to CRUD
 * documents in the tuits collection
 */

import mongoose from "mongoose";
import Tuit from "../models/Tuit";
import TuitSchema from "./TuitSchema";


const TuitModel = mongoose.model<Tuit>('TuitModel', TuitSchema);

export default TuitModel;