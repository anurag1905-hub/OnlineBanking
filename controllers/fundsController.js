const Account = require('../models/account');
const Notification = require('../models/notifications');

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
                   //convert strings to numbers using unary operator.
                   receiver.balance=+receiver.balance + +req.body.amount;
                   receiver.save();
                   let message="An amount of Rs. "+req.body.amount+" has been transferred to account number "+receiver.id;
                   Notification.create({
                       content:message,
                       user:req.user.id
                   },function(err,noti){
                       if(err){
                           console.log('could not create notification',err);
                           return;
                       }
                       else{
                           return res.redirect('back');
                       }
                   });
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