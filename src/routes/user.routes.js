import { Router } from "express";
import {loginUser, logoutUser, registerUser, 
    refreshAccessToken} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    // upload comes from multer use upload. to get list of multiple files
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-Token").post(refreshAccessToken)
// for better understanding write an article on refresh token and Access Token - ref Hashcode


export default router