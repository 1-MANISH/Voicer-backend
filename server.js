import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './database.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()
const PORT = process.env.PORT || 5500

//config dotenv
dotenv.config({path:"./.env"})


// routes import
import router from './routes.js'
import { corsOptions } from './constants/config.js'

// database connection
connectDB(process.env.DB_URL)



// middlewares
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())

// routes
app.use(router)

app.get('/', (req, res) => {
    res.send('Server is running')
})


app.listen(PORT , () => {
        console.log(`Server is running on port ${process.env.PORT || 5000} 🤔`)
})