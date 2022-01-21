const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:Number,
        required:true,
    },
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Account',
        required:true
    },
    loantype:{
        type:String,
        required:true
    },
    approved:{
        type:Boolean,
        required:true
    },
    interest:{
        type:Number,
        required:true
    },
    outstandingAmount:{
        type:Number,
    },
    monthlyInstallments:{
        type:Number
    },
    duration:{
        type:Number,
        required:true
    }
},{
    timestamps:true
});

const Loan = mongoose.model('Loan',loanSchema);

module.exports = Loan;