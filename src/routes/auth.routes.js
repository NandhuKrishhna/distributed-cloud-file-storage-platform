import { Router } from "express";
import { checkAuthHelper } from "../middleware/auth.middleware.js";
import { userLoginController } from "../controller/user.controller.js";






const authRouter = Router()




authRouter.post('/register', (req, res) => {
    res.json({ message: "User registered successfully" })
})

authRouter.post('/login', userLoginController)
authRouter.get('/logout', checkAuthHelper, (req, res, next) => {
    try {
        res.clearCookie("user")
        res.json({ message: "User logged out successfully" })
    } catch (error) {
        next(error)
    }
})
authRouter.get('/',checkAuthHelper, (req, res, next) => {
    try {
        const {user} = req.cookies
        res.json({email:user.email, name:user.name, id:user.id})
    } catch (error) {
        next(error)
    }
})

export default authRouter