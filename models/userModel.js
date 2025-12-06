const mongoose=require("mongoose");
const {Schema}=mongoose;

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    followedUsers:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    repositories:[
        {
            type:Schema.Types.ObjectId,
            ref:"Repository"
        }
    ],
    starDir:[
        {
            type:Schema.Types.ObjectId,
            ref:"Repository"
        }
    ]
})

const User=mongoose.model("User",userSchema)
module.exports={User}