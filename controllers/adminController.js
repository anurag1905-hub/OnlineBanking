const User = require('../models/user');
const Announcement = require('../models/announcement');
const Account = require('../models/account');
const Loan = require('../models/loan');
const Notifications = require('../models/notification');
const Transaction = require('../models/transaction');
const NEFT = require('../models/neft');

module.exports.announcements = async function(req,res){
    try{
        let announcement = await Announcement.find({}).sort('-createdAt');
        return res.render('./admin/announcement',{
            announcements:announcement
        });
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.adminLogin = async function(req,res){
    try{
        if(req.isAuthenticated()){
            console.log(req.user);
            let user = await User.findById(req.user._id);
            if(user.isAdmin){
                return res.redirect('/admin/announcements');
            }
            else{
                return res.redirect('/');
            }
        }
        else{
           return res.render('./admin/adminLogin');
        }
    }catch(err){
        req.flash('error','Error');
        console.log('Error',err);
        return res.redirect('/');
    }
}

module.exports.createSession = function(req,res){
    User.findById(req.user._id,function(err,user){
      if(err){
          req.flash('error','Error');
          return res.redirect('back');
      }
      else if(user){
          if(!user.isAdmin){
              req.flash('error','Unauthorized');
              return res.redirect('/admin/adminLogin');
          }
          else{
              req.flash('success','Logged In Successfully');
              return res.redirect('/admin/announcements');
          }
      }
    });
}

module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','Logged out Successfully');
    return res.redirect('/');
}

module.exports.addAnnouncement = function(req,res){
   Announcement.create(req.body,function(err,announcement){
      if(err){
          console.log('Error',err);
          return res.redirect('back');
      }
      else{
        req.flash('success','Announcement Added');
        return res.redirect('/admin/announcements');
      }
   });
}

module.exports.deleteAnnouncement = function(req,res){
    Announcement.findByIdAndDelete(req.params.id,function(err){
       if(err){
           return res.redirect('back');
       }
       else{
           return res.redirect('/admin/announcements');
       }
    });
}

module.exports.admins = function(req,res){
    User.find({isAdmin:true},function(err,admins){
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
            return res.render('./admin/admins',{
                admins:admins
            });
        }
    });
}

module.exports.addAdmin = async function(req,res){
    try{
        if(!req.body.isAdmin){
            req.flash('error','Unauthorized');
            return res.redirect('back');
        }
        let user = await User.findOne({email:req.body.email});

        if(user){
           req.flash('error','Unauthorized');
           return res.redirect('back');
        }
        
        await User.create(req.body);
        req.flash('success','Admin Added');
        return res.redirect('back');
    }catch(err){
        console.log('Error',err);
        req.flash('error','Error');
        return res.redirect('back');
    }
}

module.exports.removeAdmin = async function(req,res){
    try{
        let user = await User.findById(req.params.id);
        if(user&&user.isAdmin){
            user.remove();
            req.flash('success','Admin Removed Successfully');
            return res.redirect('back');
        }
        else{
            req.flash('error','Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error',err);

        return res.redirect('back');
    }
}

module.exports.viewAccountDetails = function(req,res){
    return res.render('./admin/accountDetails',{
        account:''
    });
}

module.exports.showDetails = async function(req,res){
    try{
        let account = await Account.findById(req.body.account).populate('user')
        //console.log(account);
        if(!account){
            return res.render('./admin/accountDetails',{
                account:''
            });
        }
        let user = await User.findById(account.user._id).populate('loans');
        let sum=0;
        for(loan of user.loans){
            if(loan.approved){
              sum=+sum + +loan.amount;
            }
        }
        return res.render('./admin/accountDetails',{
            account:account,
            loans:user.loans,
            amount:sum
        });
    }catch(err){
        console.log('Error',err);
        req.flash('error','Error');
        return res.redirect('/admin/announcements');
    }
    
}

module.exports.loanRequests = async function(req,res){
    let loans = await Loan.find({approved:false}).sort('createdAt').populate('account');
    return res.render('./admin/loanRequests',{
        loans:loans
    });
}

module.exports.rejectLoan = async function(req,res){

    try{
        let loanId = req.query.loan;
        let userId = req.query.user;
        let type = req.query.type;

        let loan = await Loan.findById(loanId);
        if(!loan){
            return res.redirect('/admin/loanRequests')
        }
        loan.remove();
        User.findByIdAndUpdate(userId,{$pull:{loans:loanId}});

        let message = "Unfortunately your request for " +type+ " has been rejected.";
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
        
        let user = await User.findById(userId);
        console.log(user);

        let notification = await Notifications.create({
            content:message,
            user:user,
            time:time
        });

        user.notifications.push(notification);
        user.save();
        req.success('error','Loan Rejected');
        return res.redirect('/admin/loanRequests');
    }catch(err){
        console.log('Error',err);
        return res.redirect('/admin/loanRequests');
    }
}

module.exports.approveLoan = async function (req,res){
    let loanId = req.query.loan;
    let userId = req.query.user;
    let type = req.query.type;
    let amount = req.query.amount;
    let duration = req.query.duration;
    let totalAmountPayable = amount*(1+0.10*duration);
    totalAmountPayable = (Math.round(totalAmountPayable * 100) / 100).toFixed(2);
    let monthlyInstallments = totalAmountPayable/(duration*12);
    monthlyInstallments = (Math.round(monthlyInstallments * 100) / 100).toFixed(2);
    let now = new Date();
    let next30days = new Date(now.setDate(now.getDate() + 30));
    let nextduedate = next30days;
    
    let loan = await Loan.findById(loanId);
    let user = await User.findById(userId).populate('account');
    if(!loan){
        return res.redirect('/admin/loanRequests');
    }
    if(!user){
        return res.redirect('/admin/loanRequests'); 
    }
    if(loan.user!=userId||loan.loantype!=type||loan.amount!=amount||loan.duration!=duration){
        return res.redirect('/admin/loanRequests');
    }
    loan.outstandingAmount = totalAmountPayable;
    loan.monthlyInstallments = monthlyInstallments;
    loan.count = 0;
    loan.nextDueDate = nextduedate;
    loan.approved = true;
    loan.save();

    User.updateOne({'loans.id': loanId}, {'$set': {
        'loans.$.outstandingAmount': totalAmountPayable,
        'loans.$.monthlyInstallments': monthlyInstallments,
        'loans.$.count': 0,
        'loans.$.nextDueDate': nextduedate,
        'loans.$.approved': true,
    }});

    let message = "Your request for "+loan.loantype+" has been approved. Rs "+ amount+" has been credited in your account. Your monthly installments will be Rs "+monthlyInstallments+" and your next due date is "+ next30days.toDateString();
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

    let notification = await Notifications.create({
        content:message,
        user:user,
        time:time
    });

    user.notifications.push(notification);
    
    user.account.balance = +user.account.balance + +amount;
    user.account.save();

    let transaction = await Transaction.create({
        content:message,
        user:user,
        amount:amount,
        mode:'CREDIT',
        increasedBalance:true,
        balance:user.account.balance
    });

    user.transactions.push(transaction);
    user.save();

    return res.redirect('/admin/loanRequests');
}

module.exports.neftTransactions =  async function(req,res){
    try{
        let neft = await NEFT.find({}).sort('createdAt');
        return res.render('./admin/neftTransactions',{
            transactions:neft
        });
    }catch(err){
        console.log('Error',err);
        return res.redirect('/admin/announcements');
    }
}

module.exports.rejectTransaction = async function(req,res){
    try{
        let neftId = req.query.neft;
        let senderAccount = req.query.sender;
        
        let neft = await NEFT.findById(neftId);

        if(!neft){
            return res.redirect('/admin/neftTransactions');
        }

        let message = "Your NEFT Transaction to "+" account Number "+neft.to+" for an amount of Rs "+neft.amount+" has been Rejected";

        neft.remove();

        let user = await User.findOne({account:senderAccount});

        if(!user){
            console.log('Oops cant find user');
            return res.redirect('/admin/neftTransactions');
        }

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

        let notification = await Notifications.create({
            content:message,
            user:user,
            time:time
        });

        user.notifications.push(notification);
        user.save();

        return res.redirect('/admin/neftTransactions');

    }catch(err){
        console.log('Error',err);
        return res.redirect('/admin/neftTransactions');
    }

}

module.exports.approveTransaction = async function(req,res){
    try{
        let neftId = req.query.neft;
        let sender = req.query.sender;
        let receiver = req.query.receiver;

        let neft = await NEFT.findById(neftId);
        if(!neft){
            return res.redirect('/admin/neftTransactions');
        }
        let senderAccount = await Account.findById(sender);
        if(!senderAccount){
            return res.redirect('/admin/neftTransactions');
        }
        let receiverAccount = await Account.findById(receiver);
        if(!receiverAccount){
            return res.redirect('/admin/neftTransactions');
        }

        let amount = neft.amount;
        neft.remove();

        senderAccount.balance = +senderAccount.balance - +amount;
        senderAccount.save();

        receiverAccount.balance = +receiverAccount.balance + +amount;
        receiverAccount.save();

        let senderUser = await User.findOne({account:sender});

        let receiverUser = await User.findOne({account:receiver});

        let firstMessage = "An amount of Rs "+amount+ " has been transferred to account number "+receiver;

        let firstTransaction = await Transaction.create({
        content:firstMessage,
        user:senderUser,
        amount:amount,
        mode:'TO TRANSFER',
        increasedBalance:false,
        balance:senderAccount.balance
        });

        senderUser.transactions.push(firstTransaction);

        let secondMessage = "An amount of Rs "+amount+ " has been transferred to your account.";

        let secondTransaction = await Transaction.create({
        content:secondMessage,
        user:receiverUser,
        amount:amount,
        mode:'BY TRANSFER',
        increasedBalance:true,
        balance:receiverAccount.balance
        });

        receiverUser.transactions.push(secondTransaction);

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

        let firstNotification = await Notifications.create({
            content:firstMessage,
            user:senderUser,
            time:time
        });

        senderUser.notifications.push(firstNotification);
        senderUser.save();

        let secondNotification = await Notifications.create({
            content:secondMessage,
            user:receiverUser,
            time:time
        });

        receiverUser.notifications.push(secondNotification);
        receiverUser.save();

        return res.redirect('/admin/neftTransactions');
    }catch(err){
        console.log('Error',err);
        return res.redirect('/admin/announcements');
    }
}

module.exports.pendingLoanPayments = async function(req,res){
    let date = new Date();
    let year = parseInt(date.getFullYear());
    let month = parseInt(date.getMonth());
    let day = parseInt(date.getDate());

    //query today up to tonight
    let loan = await Loan.find({ 
        nextDueDate: {
            $gte: new Date(year, month, day), 
            $lt: new Date(year, month, day+1), 
        }
    })
    .populate('user')
    .populate('account');

    return res.render('./admin/pendingLoanPayments',{
        loans:loan
    });
}

module.exports.sendPaymentNotification = async function(req,res){
    
    let user = await User.findById(req.query.user);

    if(!user){
        return res.redirect('/admin/pendingLoanPayments');
    }

    let loan = await Loan.findById(req.query.loan);

    if(!loan){
        return res.redirect('/admin/pendingLoanPayments');
    }

    let message = "Dear user, your monthly installment of Rs "+loan.monthlyInstallments+" for " + loan.loantype + " is due today. You are requested to pay the required amount";

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

    let notification = await Notifications.create({
        content:message,
        user:user,
        time:time
    });

    user.notifications.push(notification);
    user.save();

    loan.notificationSent = loan.notificationSent + 1;
    loan.save();

    return res.redirect('/admin/pendingLoanPayments');
}


