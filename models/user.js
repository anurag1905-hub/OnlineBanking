const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        required:true
    },
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Account',
        required:false
    },
    notifications:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Notification'
    }
},{
    timestamps:true
});

const User = mongoose.model('User',userSchema);

module.exports = User;