import mongoose from "mongoose"
import { type } from "os"

const userSchema = new mongoose.Schema({
        name:{
                type:String,
                required:false
        },
        avatar:{
                url:{
                        type:String,
                        required:false
                },
                publicId:{
                        type:String,
                        required:false
                }
        },
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