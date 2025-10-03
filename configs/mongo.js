import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    autoIndex: true,
});

mongoose.connection.on("connected", () => {
    console.log("Mongo has connected successfully");
});

mongoose.connection.on("reconnected", () => {
    console.log("Mongo has reconnected");
});

mongoose.connection.on("error", (error) => {
    console.error("Mongo connection has an error:", error);
    mongoose.disconnect(); 
});

mongoose.connection.on("disconnected", () => {
    console.warn(
        "Mongo connection is disconnected. Attempting reconnection..."
    );
    setTimeout(() => {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }, 5000); 
});
