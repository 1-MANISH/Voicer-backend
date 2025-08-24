import otpService from "../services/otp-service.js"
import hashService from "../services/hash-service.js"
import userService from "../services/user-service.js"
import tokenService from "../services/token-service.js"

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
                        await otpService.sendBySms(phone,otp)

                        res.status(200).json({
                                success:true,
                                message:'OTP sent successfully',
                                phone,
                                hash:`${hash}.${expires}`
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
                        {
                                httpOnly:true,
                                maxAge:7*24*60*60*1000
                        }
                )

                res.json({
                        success:true,
                        message:'OTP verified successfully',
                        user,
                        accessToken
                })


        }
}


export default new AuthController()


// single responsibility principle - SIngleton class