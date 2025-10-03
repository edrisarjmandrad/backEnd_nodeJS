//#region packages
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    lastLogin: { type: Date },
});

export default mongoose.model("User", userSchema);
