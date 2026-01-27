import { UserModel } from "../models/index.js";
import crypto from "crypto";
const userLoginController = async(req, res, next)=>{
    try {
          try {
    const {email , password} = req.body;
    console.log({email , password})
    const existingUser = await UserModel.findOne({email})
    if(!existingUser){
        return res.status(401).json({ message: "User not found or Invalid password or Email" })
    }
    if(existingUser.password !== password){
        return res.status(401).json({ message: "Invalid Password" })
    }

    const cookiePayload = JSON.stringify({
        id : existingUser._id.toString(),
        expiryTime : Math.round(Date.now() + 60 * 60 * 24 * 7 * 1000)
    })
    const signature = crypto.createHash("sha256").update(cookiePayload).update(process.env.MY_SECRET_KEY).digest("base64url")
    const signedCookie = Buffer.from(cookiePayload).toString("base64url")
    const cookieString = `${signedCookie}.${signature}`
    console.log({cookieString:cookieString})
    res.cookie("token", cookieString,{
        httpOnly : true,
        maxAge: 60 * 60 * 24 * 7 * 1000
    })
    res.json({ message: "User logged in successfully" , user : existingUser})
   } catch (error) {
    next(error)
   }
    } catch (error) {
        
    }
}



export {userLoginController}