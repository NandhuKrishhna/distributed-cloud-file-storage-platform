import { UserModel } from "../models/index.js";
export const checkAuthHelper = async(req,res,next)=>{
    const {token} = req.signedCookies 
    if(!token){
        return res.status(401).json({ message: "User not found or Invalid password or Email" })
    }
    console.log({token:token})
    const {id , expiryTime} = JSON.parse(token)
    console.log({id,expiryTime})

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