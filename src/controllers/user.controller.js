import { ApiError } from '../utils/Apierror.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { uploadCloudinary } from '../utils/fileuplaod-cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { json } from 'express';
import { Jwt } from 'jsonwebtoken';




const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return{accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh token")
    }
}




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

const loginUser = asyncHandler(async(req, res) => {
    // req body -> data
    // username or email
    // find the user
    // check for password
    // access and refresh token
    // send cookies or secure cookies

    // taking data from body
    const {email, username, password} = req.body
    // checking data is provided or not required for login
    if (!username || !email){
        throw new ApiError(404, "Username or password is required")
    }
    // 

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user){
        throw new ApiError(404, "Username or email is incorrect")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)


    if (!isPasswordCorrect){
        throw new ApiError(401, "Invalid User Credentials")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = User.findById(user._id).select("-password, -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken //data in utils/apiresponse
            },
            "user logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    // req.user._id
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
        
    )

    const options = {
        httpOnly: true,
        secure: true
    }
})
    // creating an endpoint where user can refresh their token

    const refreshAccessToken = asyncHandler(async (req, res) =>{
        req.cookies.refreshToken || req.body.refreshToken

        if(!incomingRefreshToken){
            throw new ApiError(401, "unauthorized request")
        }

    const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        // require access to refresh token via mongodb to get data
     try {
          const user = await User.findById(decodedToken?._id)
          
          if(!user){
           throw new ApiError(401, "Invalid Refresh Token")
       }
       // matching both tokens
       if (incomingRefreshToken !== user?.refreshToken){
           throw new ApiError(401, "Refresh Token is expired or used")
       }
   
       // generating new token
       const options = {
           httpOnly: true,
           secure: true
       }
       const {accessToken, newrefReshToken} = await generateAccessAndRefreshTokens(user._id)
   
       return res
       .status(299)
       .cookie("accessToken", accessToken)
       .cookie("refreshToken")
       .json(
           new ApiResponse(200, {accessToken, refreshToken: newrefReshToken}, "Access token refreshed successfully")
       )
     } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
     }
})
    // do what we can do take what information needed as we needed
    // here are some basic information should take definatly take for some instance or every project needs that 

     const changeCurrentPassword = asyncHandler(async(req, res) =>{
        const {oldPassword, newPassword} = req.body

        // req.user?._id

        const user = await User.findById(req.user?._id)
       const isPasswordCorrect = user.isPasswordCorrect(oldPassword)

       if(!isPasswordCorrect){
        throw new ApiError(408, "Invalid old Credentials")
       }
       else{
        user.password = newPassword
        await user.save({validateBeforeSave: false})

        return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Successfully"))
       }
       return res
       .status(200)
       .clearCookie("accessToken", options)
       .clearCookie("refreshToken", options)
       .json(new ApiResponse(200, {}, "User Successfully logged Out"))
    })


// Taking current user as in middleware we passsed complete user in req.body

const getCurrentUser = asyncHandler(async(req, res) =>{
    return res
    .status(200)
    .json(200, req,user, "current user fetched Successfully")
})


const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullname, email} = req.body

    if(!fullname || !email){
        throw new ApiError(400, "All fields are required")
    }

    const user = User.findByIdAndUpdate(req.user?._id, {
        $set:{
            fullname,
            email: email // its inconsistance fix it later on
        }
    }, 
    {new: true}
    ).select("-password")

    return res
    .status(209)
    .json(new ApiResponse(200, user, "Account details updated Successfully"))
})
// if update needs to be a file instead of data make another endpoint as secure coding

const updatreUserAvatar = asyncHandler(async(req, res) =>{
    const avatarLocalPath = req.files?.path
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is mising")
}

// uploading on cloudinary
    const avatar = await uploadCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "!Warning Error while uploading avatar")
    }
// updating user avatar
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar has been updated Successfully"))
})

const updateUserCoverImage = asyncHandler(async(req, res) =>{
    const coverImageLocalPath = req.files?.path
    if(!coverImageLocalPath){
        throw new ApiError(400, "Avatar file is mising")
}

// uploading on cloudinary
    const CoverImage = await uploadCloudinary(coverImageLocalPath)

    if(!CoverImage.url){
        throw new ApiError(400, "!Warning Error while uploading coverImage")
    }
// updating user avatar
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "coverImage has been updated Successfully"))
})


export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updatreUserAvatar,
    updateUserCoverImage
 };
