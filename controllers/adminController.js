const User = require('../models/user');
const Announcement = require('../models/announcement');
const Account = require('../models/account');
const Loan = require('../models/loan');
const Notifications = require('../models/notification');

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
    let loans = await Loan.find({approved:false}).sort('-createdAt').populate('account');
    return res.render('./admin/loanRequests',{
        loans:loans
    });
}

module.exports.approveLoan = function(req,res){
    return res.redirect('/admin/loanRequests');
}

module.exports.rejectLoan = async function(req,res){
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
    
    return res.redirect('/admin/loanRequests');
}

module.exports.pendingLoanPayments = function(req,res){
    return res.render('./admin/pendingLoanPayments');
}

