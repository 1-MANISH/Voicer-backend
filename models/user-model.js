import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
        name:{
                type:String,
                required:false
        },
        avatar:{
                url:{
                        type:String,
                        required:false,
                },
                publicId:{
                        type:String,
                        required:false
                },
                
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
        timestamps:true,
        toJSON:{
                virtuals:true,
                transform(doc,ret){
                        if(ret.avatar && ret.avatar.url){
                                ret.avatar = ret.avatar.url
                        }else{
                                ret.avatar = null
                        }
                        return ret
                }
        }
})


export const User = mongoose.models.User || mongoose.model("User",userSchema)