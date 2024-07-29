import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async(req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    const { username, email, fullname, password } = req.body
    console.log("email:", email);

    if (
        [username, email, fullname, password].some((field) => 
        field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new apiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path  // check if avatar is present
    const coverImageLocalPath = req.files?.coverImage[0]?.path  // check if cover image is present

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new apiError(400, "Avatar file is not uploaded")
    }

    const user = await User.create({
        username: username.toLowerCase(), 
        email, 
        fullname, 
        password, 
        avatar: avatar.url, 
        coverImage: coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user")
    }
    
    return res.status(201).json(
        new apiResponse(201, "User registered successfully", createdUser)
    )
})


export { registerUser }