//#region packages
import express from "express";
import route from "./routes/routes.js"

const app = express();

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example route
app.get("/", (req, res) => {
  res.send("NOW we'er on");
});

export default app;