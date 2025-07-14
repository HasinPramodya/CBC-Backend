import express from "express"
import {
    createContact,
    createUser,
    getAllUsers,
    getCurrentUser,
    googleLogin,
    loginUser
} from "../controller/user.controller.js"

const userRouter = express.Router()

userRouter.post('/',createUser)
userRouter.post('/login',loginUser)
userRouter.post('/google',googleLogin)
userRouter.get('/current',getCurrentUser)
userRouter.get('/all',getAllUsers)
userRouter.post('/contact',createContact)


export default userRouter