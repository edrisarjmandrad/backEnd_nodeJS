//#region packages
import jwt from "jsonwebtoken";

export default {
    auth: (req,res,next)=>{
        try{
            const token = req.header("auth_token");
            if(!token) res.status(401).send("Access denied");
            const verified = jwt.verify(token, process.env.TOKENT_SECRET);
            req.user = verified;
            next();
        }catch(err){
            res.status(500).send("Invalide token")
        }
    }
}