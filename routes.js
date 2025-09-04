import express from "express"
import  authController from './controllers/auth-controller.js'
import activateController from "./controllers/activate-controller.js"
import roomsController from "./controllers/rooms-controller.js"
import { authMiddleware } from "./middlewares/auth-middleware.js"

const router = express.Router()


// authentication
router.get('/api/v1/refresh',authController.refresh)

router.post('/api/v1/send-otp',authController.sendOtp)

router.post('/api/v1/verify-otp',authController.verifyOtp)


// those who authenticated
router.post('/api/v1/user-logout',authMiddleware,authController.logout)

router.post('/api/v1/activate-user',authMiddleware,activateController.activateUser)

// rooms
router.post('/api/v1/rooms/create',authMiddleware,roomsController.createRoom)

router.get('/api/v1/rooms/all',authMiddleware,roomsController.index)

router.get('/api/v1/room/:roomId',authMiddleware,roomsController.show)

export default router