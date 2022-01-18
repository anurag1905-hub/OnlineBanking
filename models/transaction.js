const mongoose = require('mongoose');

const transactionsSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{
    timestamps:true
});

const Transaction = mongoose.model('Notification',transactionsSchema);

module.exports = Transaction;