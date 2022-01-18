const Account = require('../models/account');
const Transaction = require('../models/transaction');
const User = require('../models/user');

module.exports.transfer = async function(req,res){
    try{
        let targetAccount = await Account.findById(req.params.id);
        if(targetAccount){
            if(targetAccount.user!=req.user.id){
                console.log('You are not permitted to perform this action.');
                return res.redirect('back');
            }
            else if(targetAccount.balance<req.body.amount){
                console.log('Insufficient balance');
                return res.redirect('back');
            }
            else{
                   let receiver = await Account.findById(req.body.beneficiaryAccountNumber);
                   if(receiver.ifscCode!=req.body.ifscCode||receiver.id==targetAccount.id){
                       console.log('Beneficiary not supported');
                       return res.redirect('back');
                   }
                   else{
                       targetAccount.balance=targetAccount.balance-req.body.amount;
                       targetAccount.save();
                       //convert strings to numbers using unary operator.
                       receiver.balance=+receiver.balance + +req.body.amount;
                       receiver.save();
                       let message="An amount of Rs. "+req.body.amount+" has been transferred to account number "+receiver.id;
                       let beneficiaryUser = await User.findOne({account:receiver._id});
                       let secondMessage = "An amount of Rs. "+req.body.amount+" has been transferred to your account";
                       await Transaction.insertMany([ 
                           { content: message, user: req.user._id}, 
                           { content: secondMessage, user: beneficiaryUser._id}, 
                       ]);
                       return res.redirect('back');
                   }
            }
        }
        else{
            console.log('Account not found',err);
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}