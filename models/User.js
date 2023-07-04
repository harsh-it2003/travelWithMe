const mongoose = require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minLength:5,
    },
    posts:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Post"
        }
    ]
});

const Users=new mongoose.model('User',userSchema);

module.exports=Users;