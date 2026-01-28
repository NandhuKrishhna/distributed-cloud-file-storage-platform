import {model, Schema} from "mongoose";

const sessionSchema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  createAt:{
    type:Date,
    default:Date.now(),
   expires: 60 * 30
  }
  
})


const SessionModel = model("session",sessionSchema)

export default SessionModel