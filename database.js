import mongoose from "mongoose"

import dns from "dns"

dns.setServers(["1.1.1.1","8.8.8.8","8.8.4.4"]);

export const connectDB  = async (DB_URL)=>{
        try {
                console.log(DB_URL)
                const connectionResult = await mongoose.connect(DB_URL,{
                        dbName:"Voicer"
                })
                console.log(`MongoDB Connected 👍 : ${connectionResult.connection.host}`)
        } catch (error) {
                console.log(error);
                process.exit(1);// exit with failure
        }
}