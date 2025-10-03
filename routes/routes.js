//#region packages
import express from "express";
import user from "../controller/user.js";
import authentication from '../middleware/verifyToken.js'

const router = express.Router();

router.post("/signUp", user.onSignUp);
router.post("/login", user.onLogin);
// Add more routes as needed, e.g.:
router.delete("/user/:id", authentication.auth, user.onDelete);
router.patch("/user/:id", authentication.auth, user.onEdit)

export default router;