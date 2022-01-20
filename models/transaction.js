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
    },
    amount:{
        type:Number,
        required:true,
    },
    mode:{
        type:String,
        required:true
    },
    increasedBalance:{
        type:Boolean,
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
},{
    timestamps:true
});

const Transaction = mongoose.model('Transaction',transactionsSchema);

module.exports = Transaction;