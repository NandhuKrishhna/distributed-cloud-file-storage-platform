import { UserModel } from "../models/index.js";
const userLoginController = async(req, res, next)=>{
 
          try {
    const {email , password} = req.body;
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

    res.cookie("token", cookiePayload,{
        httpOnly : true,
        signed : true,
        maxAge: 60 * 60 * 24 * 7 * 1000
    })
    res.json({ message: "User logged in successfully" , user : existingUser})
   } catch (error) {
    next(error)
   }
}



export {userLoginController}