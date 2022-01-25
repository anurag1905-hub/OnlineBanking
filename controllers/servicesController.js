const User = require('../models/user');
const Transaction = require('../models/transaction');
const Loan = require('../models/loan');

module.exports.depositFunds = async function(req,res){
    try{
        let user = await User.findById(req.user._id);
        if(!user||!user.account){
            return res.redirect('/user/profile');
        }
        else{
            let unreadNotifications = user.notifications.length-user.lastCount;
            return res.render('./user/depositFunds',{
                profileUser:user,
                unreadNotifications:unreadNotifications
            });
        }
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.withdrawFunds = async function(req,res){
    try{
        let user = await User.findById(req.user._id);
        if(!user||!user.account){
            return res.redirect('/user/profile');
        }
        else{
            let unreadNotifications = user.notifications.length-user.lastCount;
            return res.render('./user/withdrawFunds',{
                profileUser:user,
                unreadNotifications:unreadNotifications
            });
        }
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.miniStatement = async function(req,res){
    try{
        let user = await User.findById(req.user._id)
        .populate('account')
        .populate({
            path:'transactions',
            perDocumentLimit:10,    //show only 10 recent transactions
            options:{
                sort: { createdAt: -1},
            }
        });
        if(!user||!user.account){
            return res.redirect('/user/profile');
        }
        const date = new Date();
        let unreadNotifications = user.notifications.length-user.lastCount;
        return res.render('./user/miniStatement',{
            transactions:user.transactions,
            date:date,
            unreadNotifications:unreadNotifications
        });
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.accountStatement = async function(req,res){
    try{
        let user = await User.findById(req.user._id).populate('account');
        if(!user||!user.account){
            return res.redirect('/user/profile');
        }
        let unreadNotifications = user.notifications.length-user.lastCount;
        return res.render('./user/accountStatement',{
            account:user.account,
            transactions:user.something,
            unreadNotifications:unreadNotifications
        });
    }catch(err){
        console.log('Error',err);
        res.redirect('/user/profile')
    }
}

module.exports.showaccountStatement = async function(req,res){
    try{
        let startdate = req.body.startDate;
        let enddate = req.body.endDate;
        let user = await User.findById(req.user._id)
        .populate('account')
        .populate({
            path:'transactions',
            options:{
                created_on: {
                    $gte: new Date(startdate), 
                    $lt: new Date(enddate)
                },
                sort: { createdAt: -1},
            }
        });
        req.body="";
        let content = "Account statements for the period from "+startdate + " to "+enddate;
        let unreadNotifications = user.notifications.length-user.lastCount;
        return res.render('./user/accountStatement',{
            account:user.account,
            transactions:user.transactions,
            content:content,
            unreadNotifications:unreadNotifications
        });
   }catch(err){
       console.log('Error',err);
   }
}

module.exports.accountSummary = async function(req,res){
    try{
        let user = await User.findById(req.user._id).populate('account').populate('loans');
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
        const months = ["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
        let unreadNotifications = user.notifications.length-user.lastCount;
        return res.render('./user/accountSummary',{
            profileUser:user,
            time:time,
            date:date,
            months:months,
            unreadNotifications:unreadNotifications
        });
    }catch(err){
        console.log('Error',err);
        return res.redirect('/user/profile');
    }
}

module.exports.payLoans = async function(req,res){
    try{
        let date = new Date();
        let year = parseInt(date.getFullYear());
        let month = parseInt(date.getMonth());
        let day = parseInt(date.getDate());

        let loan = await Loan.find({user:req.user.id,approved:true,nextDueDate: {
            $gte: new Date(year, month, day), 
            $lt: new Date(year, month, day+1), 
        }});
        let user = await User.findById(req.user._id);
        let unreadNotifications = user.notifications.length-user.lastCount;
        return res.render('./user/payloan',{
            loans:loan,
            unreadNotifications:unreadNotifications
        });
    }catch(err){
        console.log('Error',err);
        return res.redirect('/user/profile');
    }
}



