const express = require('express')
const userRouter=require('./userRouter')
const repoRouter=require('./repoRouter')


const mainRouter = express.Router()
mainRouter.use(userRouter)
mainRouter.use(repoRouter)

mainRouter.get("/",(req,res)=>{
    res.send("Hello World")
})

module.exports=mainRouter;

