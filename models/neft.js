const mongoose = require('mongoose');

const neftSchema = new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Account',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    ifsc:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const NEFT = mongoose.model('NEFT',neftSchema);

module.exports = NEFT;