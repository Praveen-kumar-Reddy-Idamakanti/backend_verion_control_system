const express = require('express')
const userController=require('../controllers/userController')
const userRouter = express.Router()

userRouter.get("/getallusers",userController.getAllUsers)
userRouter.get("/getuserbyid/:id",userController.getUserById)
userRouter.post("/signup",userController.signup)
userRouter.post("/login",userController.login)
userRouter.get("/profile/:id",userController.getUserProfileById)
userRouter.put("/profile/:id",userController.updateUserProfile)
userRouter.delete("/profile/:id",userController.deleteUserProfile)

module.exports=userRouter

