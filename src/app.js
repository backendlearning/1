import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// cookie-parser to perform crud operation on user browser
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// url configuration taking data from url
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes
// segragation of files
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter )

// http://localhost:8000/api/v1/users/register
export {app}