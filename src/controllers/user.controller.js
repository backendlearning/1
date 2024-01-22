import { ApiError } from '../utils/Apierror.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { uploadCloudinary } from '../utils/fileuplaod-cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    // Get the details from front-end - it depends on user model
    // validate the details - !null
    // check if user already exists - username, email
    // check for Images, and avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return res

   
   
    // checking one by one
    // if (fullname === ""){
    //     throw new ApiError(400, "fullname is required")
    // }
    
    
    //on multiple instance
    // Get the details from FF
    const { fullname, email, username, password } = req.body;
    console.log('email: ', email);


    //validating the details
    if (
        [fullname, email, username, password].some(
            (field) => field?.trim() === ''
        )
    ) {
        throw new ApiError(400, 'All fields are Required');
    }
    // or can also check for email or something || Create a different file for email validation or something to validate and just call here to do tasks 
    
    // Checking if user already exists
    // it checks in const { fullname, email, username, password } = req.body; on line 29:
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    // if user found throwing an error with existed api error response
    // to make it better check for username and email or more stuff can be done here
    if (existedUser) {
        throw new ApiError(409, 'User with email or username already exists');
    }
    console.log(req.files);

    // taking Images and avater
    // req.files are given by multer taking first property if not get it sends the path associated on multer 
    const avaterLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    //   console.log(avaaterLocalPath)
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
            coverImageLocalPath = req.files.coverImage[0].path
    }
    // checking if I got the user Image and avatar or not
    if (!avaterLocalPath) {
        throw new ApiError(400, 'Avatar file is required');
    }

    // uploading them to cloudinary 
    const avatar = await uploadCloudinary(avaterLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)

    // Its an Important step checking once again avatar is in db or not if not db phatega.
    if (!avatar){
        throw new ApiError(400, 'Avatar file is required');
    }

    // create user object - create entry in db
        const user = await User.create({
        fullname,
        avatar: avatar.url, // Its 100% checked if avatar uploaded
        coverImage: coverImage?.url || "", // it not checked if it empty the db phatega
        email,
        password,
        username: username.toLowerCase()
    })

    // Check if user created or not 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
     
    if(!createdUser) {
        throw new ApiError(500, "! Sorry There is an server issue")
    }

    // returning response
    // return res.status(201).json({createdUser})
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
});

export { registerUser };
