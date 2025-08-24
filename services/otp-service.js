import crypto from 'crypto'
import twilio from 'twilio'
import dotenv from 'dotenv'
import hashService from './hash-service.js'
dotenv.config({path:"./.env"})

class OtpService{

        constructor() {
                this.smsSID = process.env.SMS_SID
                this.smsAuthToken = process.env.SMS_AUTH_TOKEN
                this.fromNumber = process.env.SMS_FROM_NUMBER
                this.twilioClient = twilio(this.smsSID, this.smsAuthToken, {
                        lazyLoading: true,
                })
        }

        async generateOtp(){
                const otp =  crypto.randomInt(1000,9999)
                return otp
        }

        async sendBySms(phone,otp){
                return await this.twilioClient.messages.create({
                        body:`Your Voicer OTP is ${otp}`,
                        from:this.fromNumber,
                        to:phone
                })
        }

        async sendByEmail(){

        }

       
        async verifyOtp(hashedOtp,data){
                const computedHash = await hashService.hashOtp(data)
                return computedHash === hashedOtp

        }

}


export default new OtpService()