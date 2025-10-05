//#region packages
import express from "express";
import route from "./routes/routes.js"
import cron from "node-cron";
import otpModel from "./models/otp.js";

const app = express();

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", route)

app.get("/", (req, res) => {
  res.send("NOW we'er on");
});



cron.schedule("0 * * * *", async () => {
    try {
        const result = await otpModel.deleteMany({ expireAt: { $lt: new Date() } }).lean();
        if (result.deletedCount > 0) {
            console.log(`Deleted ${result.deletedCount} expired OTP(s).`);
        }
    } catch (error) {
        console.error("Error deleting expired OTPs:", error.message);
    }
});

export default app;