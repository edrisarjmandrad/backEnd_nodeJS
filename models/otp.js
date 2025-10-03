//#region packages
import { number, required } from "joi";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const otpSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    key: { type: String, required: true },
});

export default mongoose.model("otp", otpSchema);
