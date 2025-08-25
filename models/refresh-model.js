import mongoose from "mongoose"

const refreshTokensSchema = new mongoose.Schema({
        token:{
                type:String,
               required:true
        },
        userId:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"User"
        }
},{
        timestamps:true
})


export const RefreshTokens = mongoose.models.RefreshTokens || mongoose.model("RefreshTokens",refreshTokensSchema)