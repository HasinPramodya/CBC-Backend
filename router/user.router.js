import express from "express"
import {
    changePassword,
    createContact,
    createUser,
    getAllUsers,
    getCurrentUser,
    googleLogin,
    loginUser, sendOTP
} from "../controller/user.controller.js"

const userRouter = express.Router()

userRouter.post('/',createUser)
userRouter.post('/login',loginUser)
userRouter.post('/google',googleLogin)
userRouter.get('/current',getCurrentUser)
userRouter.get('/all',getAllUsers)
userRouter.post('/contact',createContact)
userRouter.post('/send',sendOTP)
userRouter.post('/changepw',changePassword)


export default userRouter