import express from "express"
import  authController from './controllers/auth-controller.js'

const router = express.Router()


router.post('/api/v1/send-otp',authController.sendOtp)

router.post('/api/v1/verify-otp',authController.verifyOtp)

export default router