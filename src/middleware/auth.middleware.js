import { UserModel } from "../models/index.js";
import crypto from "crypto"
export const checkAuthHelper = async(req,res,next)=>{
    const {token} = req.cookies 
    if(!token){
        return res.status(401).json({ message: "User not found or Invalid password or Email" })
    }
    const [payload , oldSignature] = token.split(".")
    const {id , expiryTime} = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"))
    const rawPayload = Buffer.from(payload, "base64url").toString("utf-8")
    const newSignature = crypto.createHash("sha256").update(rawPayload).update(process.env.MY_SECRET_KEY).digest("base64url")
    if(newSignature !== oldSignature){
        return res.status(401).json({ message: "Invalid Token Signature" })
    }

    const isValidUser = await UserModel.findById(id).lean();
    if(!isValidUser){
        return res.status(401).json({ message: "User not found or Invalid password or Email" })
    }
    const {password , ...rest} = isValidUser   
    req.user = rest
    
    // Expiry matches controller's ms format
    if(expiryTime < Date.now()){
        return res.status(401).json({ message: "User session expired" })
    }
    next()
}