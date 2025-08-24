import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './database.js'

//config dotenv
dotenv.config({path:"./.env"})


const app = express()
const PORT = process.env.PORT || 5500

// database connection
connectDB(process.env.DB_URL)

// routes import
import router from './routes.js'


// middlewares
app.use(express.json())


app.use(router)

app.get('/', (req, res) => {
    res.send('Server is running')
})


app.listen(PORT , () => {
        console.log(`Server is running on port ${process.env.PORT || 5000} 🤔`)
})