import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"
import { directoryRouter, fileRouter, authRouter } from "./src/routes/index.js";
import { checkAuthHelper, requestLogger } from "./src/middleware/index.js";
import { connectToDB } from "./src/config/mongo.connection.js";
import { seedUser } from "./src/utils/seedUser.js";
import dotenv from "dotenv"

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()
app.use(cookieParser(process.env.MY_SECRET_KEY))
app.use(express.json())
app.use(requestLogger)

app.use(cors({
    origin: [
        "http://localhost:5173",
    ],
    credentials: true
}));

// 3. Static File Serving
app.use(express.static("storage"))
app.get("/user", (req,res, next)=>{
    res.set("Location", "/helloworld")
    res.status(301).end()
})
app.use("/files",checkAuthHelper, fileRouter)
app.use("/directory",checkAuthHelper, directoryRouter)
app.use("/auth",authRouter)

app.use((err, req, res, next) => {
    console.log("[❌Some Error Occured]")
    console.log(err)
    console.log('[ERROR] : ', err.message)
    res.status(500).json({ error: err.message ||  "Internal Server Error" })
})

    

app.listen(PORT, async () => {
    await connectToDB()
    // await seedUser()
    console.log(`Server is running on port ${PORT}`)
})