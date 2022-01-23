const Notifications = require('../models/notification');
const User = require('../models/user');
const Loan = require('../models/loan');

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
        req.flash('success','Applied Successfully'); 
        return res.redirect('back');
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}