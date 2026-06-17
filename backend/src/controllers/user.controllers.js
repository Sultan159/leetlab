import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiRsponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import bcrypt from "bcryptjs"

const registerUser = asyncHandler( async(req, res) => {
    const {username, email, password} = req.body

    const existingUser = await db.user
})  