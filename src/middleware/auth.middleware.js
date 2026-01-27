import { UserModel } from "../models/index.js";

export const checkAuthHelper = async(req,res,next)=>{
    const {user } = req.cookies 
  const isValidUser = await UserModel.findById(user).lean();
    if(!isValidUser){
        return res.status(401).json({ message: "User not found or Invalid password or Email" })
    }
    const {password , ...rest} = isValidUser   
    req.user = rest

    // const isValidUser = await UserModel.findOne({_id:parsedUser.id})
    // if(!isValidUser){
    //  return res.status(401).json({ message: "User not found or Invalid password or Email" })
    // }
    // if(parsedUser.expiryTime < Math.round(Date.now() / 1000)){
    //     return res.status(401).json({ message: "User session expired" })
    // }
    next()
}