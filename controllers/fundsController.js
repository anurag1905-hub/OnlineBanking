const Account = require('../models/account');
const Transaction = require('../models/transaction');
const User = require('../models/user');
const Notifications = require('../models/notification');

module.exports.transfer = async function(req,res){
    try{
        let targetAccount = await Account.findById(req.params.id);
        if(targetAccount){
            if(targetAccount.user!=req.user.id){
                req.flash('error','Unauthorized');
                return res.redirect('back');
            }
            else if(targetAccount.balance<req.body.amount){
                req.flash('error','Insufficient Balance');
                return res.redirect('back');
            }
            else{
                   let receiver = await Account.findById(req.body.beneficiaryAccountNumber).populate('user');
                   if(receiver.ifscCode!=req.body.ifscCode||receiver.id==targetAccount.id){
                       req.flash('error','Unauthorized');
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
                       let firstTransaction = await Transaction.create( 
                           { content: message, user: req.user._id, amount:req.body.amount,mode:'TO TRANSFER',increasedBalance:false},  
                       );
                       let senderUser = await User.findById(req.user._id); 
                       senderUser.transactions.push(firstTransaction);
                       senderUser.save();
                       let secondTransaction = await Transaction.create( 
                        { content: secondMessage, user: beneficiaryUser._id,amount:req.body.amount,mode:'BY TRANSFER',increasedBalance:true}, 
                       );
                       beneficiaryUser.transactions.push(secondTransaction);
                       beneficiaryUser.save();
                       let date = new Date();
                       let hours = date.getHours().toString();
                       if(hours.length==1){
                           hours="0"+hours;
                       }
                       let minutes = date.getMinutes().toString();
                       if(minutes.length==1){
                           minutes="0"+minutes;
                       }
                       let seconds = date.getSeconds().toString();
                       if(seconds.length==1){
                           seconds="0"+seconds;
                       }
                       let time = hours+":"+minutes+":"+seconds;
                       await Notifications.insertMany([ 
                            { content: message, user: req.user._id,time:time}, 
                            { content: secondMessage, user: beneficiaryUser._id,time:time}, 
                       ]);
                       req.flash('success','Funds Transferred');
                       return res.redirect('back');
                   }
            }
        }
        else{
            req.flash('error','Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error','Unauthorized');
        return res.redirect('back');
    }
}

module.exports.deposit = async function(req,res){
    try{
        let user = await User.findById(req.body.user).populate('account');
        
        if(!user || user.password!=req.body.password||user.account.id!=req.body.accountNumber){
            req.flash('error','Unauthorized');
            return res.redirect('back');
        }
        let amountToBeAdded = req.body.amount;
        //convert strings to numbers using unary operator.
        user.account.balance = +user.account.balance + +amountToBeAdded;
        user.account.save();
        let message = "An amount of Rs "+amountToBeAdded+" has been deposited in your account";
        let transaction = await Transaction.create({
            content:message,
            user:user,
            amount:amountToBeAdded,
            mode:'CREDIT',
            increasedBalance:true
        });
        user.transactions.push(transaction);
        user.save();
        let date = new Date();
        let hours = date.getHours().toString();
        if(hours.length==1){
            hours="0"+hours;
        }
        let minutes = date.getMinutes().toString();
        if(minutes.length==1){
            minutes="0"+minutes;
        }
        let seconds = date.getSeconds().toString();
        if(seconds.length==1){
            seconds="0"+seconds;
        }
        let time = hours+":"+minutes+":"+seconds;
        await Notifications.create({
            content:message,
            user:user,
            time:time
        });
        req.flash('success','Deposited');
        return res.redirect('back');
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.withdraw = async function(req,res){
    try{
        let user = await User.findById(req.body.user).populate('account');
        
        if(!user || user.password!=req.body.password||user.account.id!=req.body.accountNumber||user.account.balance<req.body.amount){
            req.flash('error','Unauthorized');
            return res.redirect('back');
        }
        let amountToBeReduced = req.body.amount;
        user.account.balance = user.account.balance - amountToBeReduced;
        user.account.save();
        let message = "An amount of Rs "+amountToBeReduced+" has been withdrawn from your account";
        let transaction = await Transaction.create({
            content:message,
            user:user,
            amount:amountToBeReduced,
            mode:'DEBIT',
            increasedBalance:false
        });
        user.transactions.push(transaction);
        user.save();
        let date = new Date();
        let hours = date.getHours().toString();
        if(hours.length==1){
            hours="0"+hours;
        }
        let minutes = date.getMinutes().toString();
        if(minutes.length==1){
            minutes="0"+minutes;
        }
        let seconds = date.getSeconds().toString();
        if(seconds.length==1){
            seconds="0"+seconds;
        }
        let time = hours+":"+minutes+":"+seconds;
        await Notifications.create({
            content:message,
            user:user,
            time:time
        });
        req.flash('success','Withdrawn');
        return res.redirect('back');
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}