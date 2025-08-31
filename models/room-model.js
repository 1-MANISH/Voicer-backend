import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
        roomTopic:{
                type:String,
                required:true
        },
        roomType:{
                        type:String,
                required:true,
                enum:["open","social","closed"]
        },
        ownerId:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"User"
        },
        speakers:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
        }]
},{
        timestamps:true
})


export const Room = mongoose.models.Room || mongoose.model("Room",roomSchema)