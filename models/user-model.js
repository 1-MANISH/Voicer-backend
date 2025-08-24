import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
        phone:{
                type:String,
                unique:true
        },
        activated:{
                type:Boolean,
                required:false,
                default:false
        }
},{
        timestamps:true
})


export const User = mongoose.models.User || mongoose.model("User",userSchema)