const Notifications = require('../models/notification');
const User = require('../models/user');
const Loan = require('../models/loan');
const Transaction = require('../models/transaction');

function getTime(){
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
    return time;
}

module.exports.apply = async function(req,res){
    if(req.body.approved==true){
        req.flash('error','Unauthorized');
        return res.redirect('back');
    }
    if(req.body.interest!=10){
        req.flash('error','Unauthorized');
        return res.redirect('back');
    }
    if(req.body.notificationSent!=0){
        req.flash('error','Unauthorized');
        return res.redirect('back');
    }
    try{
        let user = await User.findById(req.body.user)
        .populate('account')
        .populate('loans');
        if(!user||user.id!=req.user._id||user.account.id!=req.body.account||user.password!=req.body.password){
            req.flash('error','Unauthorized');
            return res.redirect('back');
        }
        for(let i=0;i<user.loans.length;++i){
            if(user.loans[i].loantype==req.body.loantype){
                req.flash('error','Not Allowed');
                return res.redirect('back');
            }
        }
        let loan = await Loan.create(req.body);
        user.loans.push(loan);
        let message = "Your application for "+req.body.loantype+" has been received and will be processed shortly.";

        let time = getTime();

        let notification = await Notifications.create({
            content:message,
            user:user,
            time:time
        });
        user.notifications.push(notification);
        user.save();
        req.flash('success','Applied Successfully'); 
        return res.redirect('back');
    }catch(err){
        return res.redirect('back');
    }
}

module.exports.pay = async function(req,res){

    try{

        let loanId = req.params.id;
        let loan = await Loan.findById(loanId).populate('user').populate('account');
        
        if(!loan){
            req.flash('error','Unauthorized');
            return res.redirect('/user/services/payLoans');
        }
        //req.user.id is used to convert object id to string.
        if(loan.user._id!=req.user.id){
            req.flash('error','Unauthorized');
            return res.redirect('/user/services/payLoans');
        }

        if(loan.monthlyInstallments>loan.account.balance){
            req.flash('error','Insufficient Balance');
            return res.redirect('/user/services/payLoans');
        }
        
        let totalInstallments = (loan.duration*12);

        loan.outstandingAmount = loan.outstandingAmount-loan.monthlyInstallments;
        loan.count = loan.count + 1;
        loan.notificationSent = 0;

        let now = new Date();
        let next30days = new Date(now.setDate(now.getDate() + 30));
        let nextduedate = next30days;

        loan.nextDueDate = nextduedate;

        loan.save();


        User.updateOne({'loans.id': loanId}, {'$set': {
            'loans.$.outstandingAmount': loan.outstandingAmount,
            'loans.$.notificationSent': loan.notificationSent,
            'loans.$.count': loan.count,
            'loans.$.nextDueDate': loan.nextDueDate,
        }});

        let message = "Your monthly installment for "+loan.loantype+" of  Rs "+ loan.monthlyInstallments+" has been received" ;

        let user = await User.findById(req.user._id).populate('account');

        let time = getTime();

        let notification = await Notifications.create({
            content:message,
            user:user,
            time:time
        });

        user.notifications.push(notification);
        
        user.account.balance = user.account.balance - loan.monthlyInstallments;
        user.account.save();

        let transaction = await Transaction.create({
            content:message,
            user:user,
            amount:loan.monthlyInstallments,
            mode:'DEBIT',
            increasedBalance:false,
            balance:user.account.balance
        });

        user.transactions.push(transaction);
        user.save();

        if(loan.count==totalInstallments){
            loan.remove();
            await User.findByIdAndUpdate(req.user._id,{$pull:{loans:loanId}});
            req.flash('success','Installment Paid');
            return res.redirect('/user/services/payLoans');
        }

        req.flash('success','Installment Paid');
        return res.redirect('/user/services/payLoans');
    }catch(err){
        return res.redirect('/user/services/payLoans');
    }
}