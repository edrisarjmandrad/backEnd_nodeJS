//#region packages
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const productSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    productName: { type: String, required: true },
    categoryName: { type: String, required: true },
    price: { type: String, required: true },
    inventory: { type: Number, required: true },
    adminId: { type: String, required: true },
    img: {type: String, required: true}
});

export default mongoose.model("products", productSchema);
