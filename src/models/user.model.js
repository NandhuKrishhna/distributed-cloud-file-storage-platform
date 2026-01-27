import {model, Schema}from "mongoose";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const userSchema = new Schema({
    name:{
        type:Schema.Types.String,
        required:true
    },
    email:{
        type:Schema.Types.String,
        required:true,
        unique:true
    },
    password:{
        type:Schema.Types.String,
        required:true
    }
    
},{timestamps:true})


userSchema.plugin(aggregatePaginate)


const UserModel = model("User",userSchema)
export default UserModel

