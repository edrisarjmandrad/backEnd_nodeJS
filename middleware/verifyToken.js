//#region packages
import jwt from "jsonwebtoken";

export default {
    auth: (req, res, next) => {
        try {
            const token = req.header("auth_token");
            if (!token) res.status(401).send("access denied");
            const verified = jwt.verify(token, process.env.TOKENT_SECRET);
            req.user = verified;
            next();
        } catch (err) {
            res.status(500).send("anvalide token");
        }
    },
    adminOnly: (req, res, next) => {
        try {
            const token = req.header("auth_token");
            if (!token) return res.status(401).send("access denied");

            const verified = jwt.verify(token, process.env.TOKEN_SECRET);

            if (!verified.isAdmin) {
                return res.status(403).send("admin only");
            }

            req.user = verified;
            next();
        } catch (err) {
            res.status(401).send("invalid token");
        }
    },
};
