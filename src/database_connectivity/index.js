import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from "express";

const app = express()

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        // app.listen(process.env.PORT, () => {
        //     console.log(`App is listning on ${process.env.PORT}`)
        //    })
        console.log(`\n MongoDb connected || DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("error", error)
        // throw err
        process.exit(1)
    }
}

export default connectDB