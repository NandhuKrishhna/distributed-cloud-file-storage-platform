import { Router } from "express";
import { checkAuthHelper } from "../middleware/index.js";
import { logoutUserController, registerUserController, userLoginController } from "../controller/user.controller.js";



const authRouter = Router()

authRouter.post('/register', registerUserController)
authRouter.post('/login', userLoginController)
authRouter.get('/logout', checkAuthHelper, logoutUserController)
authRouter.get('/',checkAuthHelper, (req, res, next) => {
    try {
        const {email,name,_id } = req.user
        res.json({email,name,_id})
    } catch (error) {
        next(error)
    }
})

export default authRouter