import mongoose from "mongoose";
import dns from "node:dns";

export const connectToDB = async() => {
    // Force usage of Google DNS to resolve SRV records if local DNS fails
    try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        console.log("Custom DNS servers set to 8.8.8.8, 8.8.4.4");
    } catch(err) {
        console.warn("Failed to set custom DNS", err);
    }
   try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to database')
    } catch (error) {
        console.log('Error connecting to database', error)
        process.exit(1)
    }
}