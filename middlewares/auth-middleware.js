import tokenService from "../services/token-service.js"

async function authMiddleware(req, res, next)  {
       
        try {
            
                const{accessToken} = req.cookies // cookies parser needed
                
                if(!accessToken){
                        throw new Error()
                }

                const userData = await tokenService.validateAccessToken(accessToken)
                if(!userData){
                        throw new Error()
                }
                req.user = userData

                next()
                        
        } catch (error) {
                res.status(401).json({
                        message:'Unauthorized or Token expired',
                        success:false
                })
        }
        
        
}


export{
        authMiddleware
}