import RoomDto from "../dtos/room-dto.js"
import roomService from "../services/room-service.js"


class RoomsController{

        async createRoom(req,res){

                const {roomTopic,roomType} = req.body

                if(!roomTopic || !roomType){
                        return res.status(400).json({
                                success:false,
                                message:'All fields (Room topic and room type) are required'
                        })
                }

                // create room
                let room
                try {
                        room  = await roomService.create({
                                roomTopic,
                                roomType,
                                ownerId:req.user._id
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
                        const rooms = await roomService.getAllRooms(['open'])
                        const allRooms = rooms.map(room => new RoomDto(room))
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

                return res.status(200).json({
                        success:true,
                        message:'Room fetched successfully',
                        room:new RoomDto(room)
                })

        }
}

export default new RoomsController()