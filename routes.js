import express from "express"
import  authController from './controllers/auth-controller.js'
import activateController from "./controllers/activate-controller.js"
import { authMiddleware } from "./middlewares/auth-middleware.js"

const router = express.Router()


router.post('/api/v1/send-otp',authController.sendOtp)

router.post('/api/v1/verify-otp',authController.verifyOtp)

// those who authenticated
router.post('/api/v1/activate-user',authMiddleware,activateController.activateUser)

export default router