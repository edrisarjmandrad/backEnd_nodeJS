//#region packages
import http from "http";
import dotenv from "dotenv";
import app from "../app.js";
import redis from "redis";
import '../configs/mongo.js'
import { mongoConnect } from "../configs/database.js";

dotenv.config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

await redisClient.connect();

app.set("redisClient", redisClient);

await redisClient.set("test", "test").then(async () => {
    console.log(await redisClient.get("test"));
}).catch((err) => {
    console.log(err);
});


const port = normalizePort(process.env.PORT || "8080");
app.set("port", port);

const server = http.createServer(app);

mongoConnect(() => {
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
    server.on("error", onError);
    server.on("listening", onListening);
});



function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
}
