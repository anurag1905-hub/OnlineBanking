const Account = require('../models/account');

module.exports.transfer = function(req,res){
   Account.findById(req.params.id,function(err,account){
     if(account){
        if(account.user!=req.user.id){
            console.log('You are not permitted to perform this action.');
            return res.redirect('back');
        }
        else if(account.balance<req.body.amount){
            console.log('Insufficient balance');
            return res.redirect('back');
        }
        else{
            Account.findById(req.body.beneficiaryAccountNumber,function(err,receiver){
               if(err||receiver.ifscCode!=req.body.ifscCode){
                   console.log('Couldnt find the beneficiary');
                   return res.redirect('back');
               }
               else{
                   account.balance=account.balance-req.body.amount;
                   account.save();
                   receiver.balance=+receiver.balance + +req.body.amount;
                   receiver.save();
                   return res.redirect('back');
               }
            });
        }
     }
     else{
         console.log('Account not found',err);
         return res.redirect('back');
     }
   });
}