import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './database.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { v2 as cloudinary } from 'cloudinary';
import {createServer} from 'http'
import { Server  } from 'socket.io'
import { ACTIONS } from './socket/actions.js'

const app = express()
const PORT = process.env.PORT || 5500
const server = createServer(app) // http server
const io = new Server(server,{
        cors: {
                origin: process.env.FRONTEND_URL,
                credentials: true,
                methods: ["GET","POST","PUT","DELETE"]
        }
})

const socketUserMapping = {

}

//config dotenv
dotenv.config({path:"./.env"})
cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
})

// routes import
import router from './routes.js'
import { corsOptions } from './constants/config.js'

// database connection
connectDB(process.env.DB_URL)



// middlewares
app.use(express.json({limit:'50mb'}))
app.use(cors(corsOptions))
app.use(cookieParser())


// routes
app.use(router)

app.get('/', (req, res) => {
    res.send('Server is running')
})

// socket logics

io.on('connection', (socket) => {
        console.log('new connection !!',socket.id)

        socket.on(ACTIONS.JOIN,({roomId,user})=>{
                socketUserMapping[socket.id] = user

                // new Map
                const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

                clients.forEach(clientId=>{
                        // event emit
                        //p2p connection - client ko bol rhee hai hum 
                        io.to(clientId).emit(ACTIONS.ADD_PEER,{
                                peerId:socket.id,
                                createOffer:false,//i will do that
                                user
                        })

                         socket.emit(ACTIONS.ADD_PEER,{
                                peerId:clientId,
                                createOffer:true,
                                user:socketUserMapping[clientId]
                        })

                })

                socket.join(roomId)

        })

        // handle relay ice
        socket.on(ACTIONS.RELAY_ICE, ({peerId,icecandidate})=>{
                io.to(peerId).emit(ACTIONS.ICE_CANDIDATE,{
                        peerId:socket.id,
                        icecandidate
                })
        })

        // handle relay sdp
        socket.on(ACTIONS.RELAY_SDP, ({peerId,sessionDescription})=>{
                io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION,{
                        peerId:socket.id,
                        sessionDescription
                })
        })

        // mute handle
        socket.on(ACTIONS.MUTE,({userId,roomId})=>{

                const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

                clients.forEach(clientId=>{
                        io.to(clientId).emit(ACTIONS.MUTE,{
                                peerId:socket.id,
                                userId
                        })
                })
        })
        // unmute handle
        socket.on(ACTIONS.UNMUTE,({userId,roomId})=>{
                 const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

                clients.forEach(clientId=>{
                        io.to(clientId).emit(ACTIONS.UNMUTE,{
                                peerId:socket.id,
                                userId
                        })
                })
        })

        // handle remove peer
        // handle leave the room

        const leaveRoom = ({roomId}) =>{
                const {rooms} = socket

                Array.from(rooms).forEach(roomId=>{
                        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

                        clients.forEach(clientId=>{
                                io.to(clientId).emit(ACTIONS.REMOVE_PEER,{
                                        peerId:socket.id,
                                        userId:socketUserMapping[socket.id]?._id
                                })

                                socket.emit(ACTIONS.REMOVE_PEER,{
                                        peerId:clientId,
                                        userId:socketUserMapping[clientId]?._id
                                })
                        })

                        socket.leave(roomId)
                })

               delete socketUserMapping[socket.id]
        }

        socket.on(ACTIONS.LEAVE,leaveRoom)

        // disconnect
        socket.on('disconnecting',leaveRoom)

})


server.listen(PORT , () => {
        console.log(`Server is running on port ${process.env.PORT || 5000} 🤔`)
})