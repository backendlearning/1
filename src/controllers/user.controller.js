
import {asyncHandler} from "../utils/asyncHandler.js";


const registerUser = asyncHandler( async (req, res) => {
         res.status(200).json({
          message : "finall got the error wasted 5 hours on it"
    })
    //now creating routes it runs after hitting that route
})

export { 
    registerUser,
 }