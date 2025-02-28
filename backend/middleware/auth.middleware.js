import jwt from "jsonwebtoken"
import redisClient from "../services/redis.service.js"

export const authUser = async(req,res,next) => {
    try{
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
        console.log(token);
        if(!token){
            return res.status(401).send({error:"Unauthorized User22"});
        }
    
        const isBlackListed = await redisClient.get(token);
        if(isBlackListed){
            res.cookie("token", "", { httpOnly: true, expires: new Date(0) }); // Expire immediately

            return res.status(401).send({error:"Unauthorized user"});
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.log("JWT Verification Failed:", err.message);
            return res.status(401).send({ error: token });
        }
        req.user = decoded;
        next();
    }
    catch(err){ 
        res.status(401).send({error:"Unauthorized User11"});
    }
}