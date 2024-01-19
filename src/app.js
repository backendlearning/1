import Express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// cookie-parser to perform crud operation on user browser
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))

// url configuration taking data from url
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

export {app}