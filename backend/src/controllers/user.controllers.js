import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiRsponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import bcrypt from "bcryptjs"
import { User } from "../models/user.models.js"
import {UserRoleEnum} from "../utils/constant.js"


const generateAccessAndRefreshToken = async function(userId){
    try {
        const user = await User.findById(userId)
        if(!user){
            throw new ApiError(404, "user not found")
        }

        const refreshToken = user.generateAccessToken()
        const accessToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false})

        return {refreshToken, accessToken}
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating the access token")
    }


}

const registerUser = asyncHandler( async(req, res) => {
    // take the data
    // validate the data
    // check in the database
    // validate then
    // create the new user
    // put the token in the emailVerificationToken and also the expiry
    // 
    // save the user in the database
    // send email to the user

    const {username, email, password} = req.body

    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existingUser){
        throw new ApiError(400, "user already exist with this email or username")
    }

    const createUser = await User.create({
        username,
        email,
        password,
        isEmailVerified: false,
        role: UserRoleEnum.USER
    }) 

    const { unHashedToken, hashedToken, tokenExpiry} = user.generateRandomToken()

    user.emailVerificationToken = hashedToken
    user.emailVerificationExpiry = tokenExpiry

    await user.save()

    // here is the email sender code

    const user = await User.findById(createUser?._id).select(
        "-passwrod -emailVerificationToken -refreshToken -emailVerificationExpiry"
    )

    return res
        .status(201)
        .json(
            new ApiRsponse(
                201,
                {user},
                "user register successfully"
            )
        )

})  