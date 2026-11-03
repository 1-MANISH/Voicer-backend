import { Room } from "../models/room-model.js"

class RoomService{

        async create(payload){
                const {roomTopic,roomType,ownerId,passcode} = payload
                try {
                        return await Room.create({
                                roomTopic,
                                roomType,
                                ownerId,
                                passcode: passcode || null,
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
                        const filter = roomTypes && roomTypes.length > 0 ? {roomType:{$in:roomTypes}} : {}
                        return await Room.find(filter)
                                                        .populate('ownerId')
                                                        .populate('speakers')
                                                        .sort({ createdAt: -1 })
                                                        .exec()
                } catch (error) {
                        return error
                }
        }

        async getRoom(roomId){
                try {
                        return await Room.findOne({_id:roomId})
                                                        .populate('ownerId')
                                                        .populate('speakers')
                                                        .exec()
                } catch (error) {
                        return error
                }
        }
}

export default new RoomService()