import { isValidObjectId } from "mongoose";
import { SessionModel, UserModel } from "../models/index.js";

export const checkAuthHelper = async(req, res, next) => {
  const { token } = req.signedCookies;
  
  if (!token) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Not logged in!" });
  }

  if (!isValidObjectId(token)) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Invalid token format!" });
  }

  console.log({token:token})
  const session = await SessionModel.findById(token)
  if(!session){
    return res.status(401).json({ error: "Not logged in!" });
  }
  const user = await UserModel.findOne({ _id: session.userId }).lean();
  if (!user) {
    return res.status(401).json({ error: "Not logged in!" });
  }
  req.user = user;
  next();
}