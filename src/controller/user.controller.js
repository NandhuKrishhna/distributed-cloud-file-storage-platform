import { UserModel } from "../models/index.js";
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
    res.cookie("user", existingUser._id,{
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