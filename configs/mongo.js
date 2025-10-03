import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI); // Should print your connection string
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to handle transient issues
    autoIndex: true, // Automatically build indexes (optional, depends on your use case)
});

mongoose.connection.on("connected", () => {
    console.log("Mongo has connected successfully");
});

mongoose.connection.on("reconnected", () => {
    console.log("Mongo has reconnected");
});

mongoose.connection.on("error", (error) => {
    console.error("Mongo connection has an error:", error);
    mongoose.disconnect(); // Ensure the app knows about the disconnect
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
    }, 5000); // Retry connection after 5 seconds
});
