import jwt from 'jsonwebtoken'

class TokenService{

        constructor(){
                this.accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
                this.refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET
        }

        generateTokens(payload){
                let accessToken = jwt.sign(
                        payload,
                        this.accessTokenSecret,
                        {expiresIn:'15m'}
                )
                let refreshToken = jwt.sign(
                        payload,
                        this.refreshTokenSecret,
                        {expiresIn:'7d'}
                )
                return {accessToken,refreshToken}
        }
}

export default new TokenService()