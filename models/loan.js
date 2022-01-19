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
    }
},{
    timestamps:true
});

const Loan = mongoose.model('Loan',loanSchema);

module.exports = Loan;