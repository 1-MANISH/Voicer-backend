import RoomDto from "../dtos/room-dto.js"
import roomService from "../services/room-service.js"


class RoomsController{

        async createRoom(req,res){

                const {roomTopic,roomType,passcode} = req.body

                if(!roomTopic || !roomType){
                        return res.status(400).json({
                                success:false,
                                message:'All fields (Room topic and room type) are required'
                        })
                }

                // If closed room and no passcode provided, generate a 4-digit code
                let roomPasscode = passcode
                if(roomType === 'closed' && !roomPasscode){
                        roomPasscode = Math.floor(1000 + Math.random() * 9000).toString()
                }

                // create room
                let room
                try {
                        room  = await roomService.create({
                                roomTopic,
                                roomType,
                                ownerId:req.user._id,
                                passcode: roomPasscode
                        })
                        if(!room){
                                return res.status(500).json({
                                        success:false,
                                        message:'Room creation failed : Db error'
                                })
                        }
                } catch (error) {
                        return res.status(500).json({
                                success:false,
                                message:'Room creation failed',
                                error
                        })
                }

                const roomDto = new RoomDto(room)


                res.status(201).json({
                        success:true,
                        message:'Room created successfully',
                        room:roomDto
                })
        }

        async index(req,res){

                try {
                        const { type } = req.query
                        const typesToFetch = type ? [type] : ['open', 'social', 'closed']
                        const rooms = await roomService.getAllRooms(typesToFetch)
                        const allRooms = rooms.map(room => {
                                const dto = new RoomDto(room)
                                // Only owner gets the actual passcode
                                const isOwner = room.ownerId && (
                                        (room.ownerId._id && room.ownerId._id.toString() === req.user._id.toString()) ||
                                        room.ownerId.toString() === req.user._id.toString()
                                )
                                if (!isOwner) {
                                        dto.passcode = null
                                }
                                return dto
                        })
                        res.status(200).json({
                                success:true,
                                message:'Rooms fetched successfully',
                                rooms:allRooms
                        })
                } catch (error) {
                        res.status(500).json({
                                success:false,
                                message:'Rooms fetching failed',
                                error
                        })
                }
        }

        async show(req,res){

                const {roomId} = req.params

                if(!roomId){
                        return res.status(400).json({
                                success:false,
                                message:'Room id is required'
                        })
                }

                let room ;
                try {
                       room =  await roomService.getRoom(roomId)
                } catch (error) {
                        return res.status(500).json({
                                success:false,
                                message:'Room fetching failed',
                                error
                        })
                }

                if(!room){
                        return res.status(404).json({
                                success:false,
                                message:'Room not found'
                        })
                }

                const roomDto = new RoomDto(room)
                // Only owner gets the passcode
                const isOwner = room.ownerId && (
                        (room.ownerId._id && room.ownerId._id.toString() === req.user._id.toString()) ||
                        room.ownerId.toString() === req.user._id.toString()
                )
                if (!isOwner) {
                        roomDto.passcode = null
                }

                return res.status(200).json({
                        success:true,
                        message:'Room fetched successfully',
                        room:roomDto
                })

        }

        async verifyPasscode(req,res){
                const {roomId} = req.params
                const {passcode} = req.body

                if(!roomId){
                        return res.status(400).json({
                                success:false,
                                message:'Room id is required'
                        })
                }

                try {
                        const room = await roomService.getRoom(roomId)
                        if(!room){
                                return res.status(404).json({
                                        success:false,
                                        message:'Room not found'
                                })
                        }

                        if(room.roomType !== 'closed'){
                                return res.status(200).json({
                                        success:true,
                                        message:'Room is not closed'
                                })
                        }

                        if(room.passcode && String(room.passcode).trim() !== String(passcode || '').trim()){
                                return res.status(400).json({
                                        success:false,
                                        message:'Invalid passcode for this room'
                                })
                        }

                        return res.status(200).json({
                                success:true,
                                message:'Passcode verified'
                        })
                } catch (error) {
                        return res.status(500).json({
                                success:false,
                                message:'Failed to verify passcode',
                                error
                        })
                }
        }
}

export default new RoomsController()