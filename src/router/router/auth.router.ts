import { Router } from 'express'
import authController from '../../controllers/authController/auth.controller.js'

const authRouter = Router()

authRouter.post('/login', authController.login)
authRouter.post('/registration-user', authController.userRegistration)
authRouter.post('/registration-seller', authController.sellerRegistration)
authRouter.post('/change-password', authController.changePassword)
authRouter.post('/has-user', authController.hasUser)
authRouter.post('/login/get-new-tokens', authController.getNewTokens)

export default authRouter
