import mongoose from "mongoose"

export const connectDB  = async (DB_URL)=>{
        try {
                const connectionResult = await mongoose.connect(DB_URL,{
                        dbName:"Voicer"
                })
                console.log(`MongoDB Connected 👍 : ${connectionResult.connection.host}`)
        } catch (error) {
                console.log(error);
                process.exit(1);// exit with failure
        }
}