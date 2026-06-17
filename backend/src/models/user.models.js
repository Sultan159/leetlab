import mongoose, {Schema} from "mongoose";
import {AvailableUserRole, UserRoleEnum} from "../utils/constant.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localPath: String 
        },
        default: {
            url: "https://placehold.co/600x400",
            localPath: ""
        }
    },
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String
    },
    role: {
        type: String,
        enum: AvailableUserRole,
        default: UserRoleEnum.USER
    },
    isEmailVerified: {
        type: Boolean
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpriy: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpiry: {
        type: Date
    },
    refreshToken: {
        type: String
    }

}, {
    timestamps: true
})

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateRandomToken = function(){
    const unHashedToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");
    const tokenExpiry = Date.now() + 20 * 1000 * 1000;

    return { unHashedToken, hashedToken, tokenExpiry }
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
    {
        _id: this._id
    },
        process.env.Refresh_Token_Secret,
    {
        expiresIn: process.env.Refresh_Token_Expiry
    }
    )

}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.Access_Token_Secret,
        {
            expiresIn: process.env.Access_Token_Expiry
        }
    )
}

const User = mongoose.model("User", userSchema);