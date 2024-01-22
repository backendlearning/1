// require('dotenv').config({path: './env'})

import dotenv from "dotenv";
import connectDB from "./database_connectivity/index.js";
import { app } from "./app.js";

dotenv.config({
    path:'./.env'
})

connectDB()
.then(() =>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is Running on PORT: ${process.env.PORT}`);
    })
    app.on("error",(err) =>{
        console.log(`Error:`, error);
        throw error
    })
})
.catch((err) =>{
    console.log(`MongoDB Connection Failed !!! `, err)
})













































// when connecting to db always use secure coding practices use async/ await functionality and wrap it in try catch


/*
const app = express()
(async () =>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       // sometimes we see listners from express
       app.on("error", ()=>{
        console.log("Error", error)
        throw error
       })

       app.listen(process.env.PORT, () => {
        console.log(`App is listning on ${process.env.PORT}`)
       })
    } catch (error) {
        console.error("ERROR", error)
        throw err
    }
})()

*/