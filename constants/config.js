const corsOptions = {
        origin: [process.env.FRONTEND_URL,"http://localhost:5173"],
        methods:["GET","POST","PUT","DELETE"],
        credentials: true
}

const cookieOptions = {
        maxAge:7*24*60*60*1000,
        httpOnly: true,
        secure:false,
        sameSite:"lax"
}

export {
        corsOptions,
        cookieOptions
}