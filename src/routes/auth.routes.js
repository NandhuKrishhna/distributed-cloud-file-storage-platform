import { Router } from 'express'
import { checkAuthHelper, validate } from '../middleware/index.js'
import {
  logoutAllUserController,
  logoutUserController,
  registerUserController,
  userLoginController,
} from '../controller/user.controller.js'
import {
  loginUserSchema,
  registerUserSchema,
} from '../validators/auth.validator.js'

const authRouter = Router()

authRouter.post(
  '/register',
  validate(registerUserSchema),
  registerUserController
)
authRouter.post('/login', validate(loginUserSchema), userLoginController)
authRouter.get('/logout', checkAuthHelper, logoutUserController)
authRouter.get('/logout-all', checkAuthHelper, logoutAllUserController)
authRouter.get('/', checkAuthHelper, (req, res, next) => {
  try {
    const { email, name, _id, availableStorage, totalStorage } = req.user
    res.json({ email, name, _id, availableStorage, totalStorage })
  } catch (error) {
    next(error)
  }
})

export default authRouter
