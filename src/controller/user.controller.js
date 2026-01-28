import bcrypt from "bcrypt";
import { DirectoryModel, SessionModel, UserModel } from "../models/index.js";


const userLoginController = async(req, res, next)=>{
 
    try {
    const {email , password} = req.body;
    const existingUser = await UserModel.findOne({email})
    if(!existingUser){
        return res.status(401).json({ message: "User not found or Invalid password or Email" })
    }

    const isPasswordMatched = await existingUser.comparePassword(password)
    if(!isPasswordMatched){
        return res.status(401).json({ message: "Invalid Password" })
    }

    const allSession = await SessionModel.find({userId : existingUser.id})
    if(allSession.length >=2){
       const firstLoggedInSession = allSession[0]
       await firstLoggedInSession.deleteOne()
    }
    
    const session = await SessionModel.create({
        userId : existingUser._id,
    })


  res.cookie("token", session.id, {
    httpOnly: true,
    signed: true,
    maxAge: 60 * 1000 * 60 * 24 * 7,
  });
    res.json({ message: "User logged in successfully" , user : existingUser})
   } catch (error) {
    next(error)
   }
}
const registerUserController = async(req, res, next)=>{
    try {
        const {email , name , password} = req.body;
        const existingUser = await UserModel.findOne({email});
        if(existingUser){
            return res.status(401).json({ message: "User already exists" })
        }
        // Create user
        const user = await UserModel.create({
            email , 
            name , 
            password 
        })

        // Create root directory
        await DirectoryModel.create({
            name : "Root",
            parentDirId : null,
            isRootDirectory:true,
            userId : user._id
        });


        const session = await SessionModel.create({
        userId : user._id,
    })


  res.cookie("token", session.id, {
    httpOnly: true,
    signed: true,
    maxAge: 60 * 1000 * 60 * 24 * 7,
  });
        
        res.json({status : true ,  message: "User registered successfully" , user })
    } catch (error) {
        next(error)
    }
}
const logoutUserController = async(req, res, next) => {
    try {
        await SessionModel.findByIdAndDelete(req.signedCookies.token)
        res.clearCookie("token", {
            httpOnly: true,
            signed: true,
        })
        res.json({ message: "User logged out successfully" })
    } catch (error) {
        next(error)
    }
}
const logoutAllUserController = async(req, res, next) => {
    try {
        await SessionModel.deleteMany({userId : req.user._id})
        res.clearCookie("token", {
            httpOnly: true,
            signed: true,
        })
        res.json({ message: "User logged out successfully" })
    } catch (error) {
        next(error)
    }
}



export {userLoginController, registerUserController, logoutUserController, logoutAllUserController}