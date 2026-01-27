import mongoose from "mongoose";


export const connectToDB = async() => {
    try {
        console.log("[ Connecting to mongo database...]")
        await mongoose.connect(process.env.MONGO_URL,{dbName:process.env.DB_NAME})
        console.log("[ MongoDB connected]")      
    } catch (error) {
        console.log("[ MongoDB connection error]")
        console.log(error)
        process.exit(1)
    }
}