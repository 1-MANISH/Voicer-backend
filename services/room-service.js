import { Room } from "../models/room-model.js"

class RoomService{

        async create(payload){
                const {roomTopic,roomType,ownerId} = payload
                try {
                        return await Room.create({
                                roomTopic,
                                roomType,
                                ownerId,
                                speakers:[
                                        ownerId
                                ]
                        })
                } catch (error) {
                        return error
                }

        }

        async getAllRooms(roomTypes){
                try {
                        return await Room.find({roomType:{$in:roomTypes}})
                                                        .populate('ownerId')
                                                        .populate('speakers')
                                                        .exec()
                } catch (error) {
                        return error
                }
        }
}

export default new RoomService()