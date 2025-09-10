import otpService from "../services/otp-service.js"
import hashService from "../services/hash-service.js"
import userService from "../services/user-service.js"
import tokenService from "../services/token-service.js"
import { cookieOptions } from "../constants/config.js"
import UserDto from "../dtos/user-dto.js"
class AuthController{

        async sendOtp(req,res){

                const{phone} = req.body
                if(!phone){
                        res.status(400).json({message:'Phone number is required'})
                }

                const  otp = await otpService.generateOtp()
                const ttl = 1000*60*2
                const expires = Date.now() + ttl
                const data = `${phone}.${otp}.${expires}`

                const hash = await hashService.hashOtp(data)

                // send otp
                try {
                        // await otpService.sendBySms(phone,otp)
                        console.log(otp)
                        res.status(200).json({
                                success:true,
                                message:'OTP sent successfully',
                                phone,
                                hash:`${hash}.${expires}`,
                                otp
                        })
                } catch (error) {
                        console.log('Error in sending OTP',error);
                        return res.status(500).json({
                                message:'Message sending failed',
                                error
                        })
                }

        }

        async verifyOtp(req,res){
                const{phone,otp,hash} = req.body
                if(!phone || !otp || !hash){
                        res.status(400).json({message:'All fields are required'})
                }
                const [hashedOtp,expires] = hash.split('.')

                if(Date.now() > +expires){
                        res.status(400).json({message:'OTP expired'})
                }

                const data = `${phone}.${otp}.${expires}`

                const isValid = await otpService.verifyOtp(hashedOtp,data)

                if(!isValid){
                        return res.status(400).json({message:'Invalid OTP'})
                }

                let user
               

                // already registered or not
                try {
                        user  = await userService.findUser({phone})

                        if(!user){
                                user = await userService.createUser({phone})
                        }
                } catch (error) {
                        console.log(`Error in finding user : ${error}`)
                        return res.status(500).json({message:'DB error'})
                }

                let {accessToken,refreshToken} =tokenService.generateTokens(
                        {
                                _id:user._id,
                                activated:user.activated
                        }
                )

                res.cookie(
                        'refreshToken',
                        refreshToken,
                       cookieOptions
                )

                 res.cookie(
                        'accessToken',
                        accessToken,
                       cookieOptions
                )

                await tokenService.storeRefreshToken(refreshToken,user._id)

                const userDto = new UserDto(user)

                res.json({
                        success:true,
                        message:'OTP verified successfully',
                        user:userDto,
                        auth:true
                })

        }

        async refresh(req,res){

                // get refresh token
                const {refreshToken:refreshTokenFromCookie} = req.cookies

                if(!refreshTokenFromCookie){
                        return res.status(401).json({message:'Unauthorized ,  No refresh token in cookies',success:false})
                }

                // check token is valid or not
                let userData
                try {
                        userData = await tokenService.validateRefreshToken(refreshTokenFromCookie)
                } catch (error) {
                        return res.status(401).json({message:'Unauthorized , Invalid refresh token',success:false})
                }

                // refresh token is in db or not
                try {
                        const token = tokenService.findRefreshToken(userData._id,refreshTokenFromCookie)
                        if(!token){
                                return res.status(500).json({message:'Unauthorized , Token not found ',success:false})
                        }
                } catch (error) {
                        return res.status(401).json({message:'Unauthorized , Invalid refresh token ',success:false})
                }

                // check if valid user
                let user
                try {
                        user = await userService.findUser({_id:userData._id})
                        if(!user){
                                return res.status(500).json({message:'Unauthorized , User not found ',success:false})
                        }
                } catch (error) {
                        return res.status(401).json({message:'Unauthorized , User not found',success:false})
                }

                // generate new access token and refresh token
                let {accessToken,refreshToken} =tokenService.generateTokens(
                        {
                                _id:user._id,
                                activated:user.activated
                        }
                )

                // update refresh token in db
                try {
                        await tokenService.updateRefreshToken(refreshToken,user._id)
                } catch (error) {
                        return res.status(500).json({message:'DB error',success:false})
                }
                // put into cookies
                res.cookie(
                        'refreshToken',
                        refreshToken,
                       cookieOptions
                )

                 res.cookie(
                        'accessToken',
                        accessToken,
                       cookieOptions
                )
                const userDto = new UserDto(user)

                // response
                res.json({
                        success:true,
                        message:'Token refreshed successfully',
                        user:userDto,
                        auth:true
                })
        }

        async logout(req,res){

                const {refreshToken} = req.cookies

                // delete refresh token from db
               try {
                         await tokenService.removeRefreshToken(req.user._id,refreshToken)
               } catch (error) {
                        return res.status(500).json({message:'DB error',success:false})
               }

                // delete cookies
                res.clearCookie('refreshToken')
                res.clearCookie('accessToken')

                res.json({
                        success:true,
                        message:'Logout successfully',
                        auth:false,
                        user:null
                })

        }

}


export default new AuthController()


// single responsibility principle - SIngleton class