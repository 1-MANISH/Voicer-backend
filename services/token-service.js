import jwt from 'jsonwebtoken'
import { RefreshTokens } from '../models/refresh-model.js'

class TokenService{

        constructor(){
                this.accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
                this.refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET
        }

        generateTokens(payload){
                let accessToken = jwt.sign(
                        payload,
                        this.accessTokenSecret,
                        {expiresIn:'1d'}
                )
                let refreshToken = jwt.sign(
                        payload,
                        this.refreshTokenSecret,
                        {expiresIn:'7d'}
                )
                return {accessToken,refreshToken}
        }

        async storeRefreshToken(token,userId){
               try {
                        await RefreshTokens.create({
                                token,
                                userId
                        })
               } catch (error) {
                        console.log(error)

               }
        }

        async validateAccessToken(token){
                try {
                        return  jwt.verify(token,this.accessTokenSecret)
                } catch (error) {
                        return null
                }
        }
        async validateRefreshToken(token){
                try {
                        return  jwt.verify(token,this.refreshTokenSecret)
                } catch (error) {
                        return null
                }
        }

        async findRefreshToken(userId,token){
               try {
                       return await RefreshTokens.findOne({userId,token})
               } catch (error) {
                       return null
               }
        }

        async updateRefreshToken(token,userId){
               try {
                        await RefreshTokens.updateOne({userId},{token})
               } catch (error) {
                        console.log(error)
               }
        }

        async removeRefreshToken(userId,token){
                try {
                        await RefreshTokens.deleteOne({userId,token})
                } catch (error) {
                        console.log(error)
                }
        }
}

export default new TokenService()