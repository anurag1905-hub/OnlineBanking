const mongoose = require('mongoose');

const verifyEmailSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    accesstoken:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const verifyEmail = mongoose.model('verifyEmail',verifyEmailSchema);

module.exports = verifyEmail;