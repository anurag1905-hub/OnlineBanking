const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    accountHolder:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    aadhar:{
        type:String,
        required:true
    },
    pan:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        required:true
    },
    balance:{
        type:Number
    },
    status:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const Account = mongoose.model('Account',accountSchema);

module.exports = Account;