const User = require('../models/user');
const Account = require('../models/account');
const Notifications = require('../models/notification');
const Announcement = require('../models/announcement');

const branchToIFSC={
    "Eastern":"TOB00001234",
    "Western":"TOB00002345",
    "Northern":"TOB00003456",
    "Southern":"TOB00004567"
};

module.exports.login = function(req,res){
    if(req.isAuthenticated()){
        User.findById(req.user._id,function(err,user){
           if(err){
               return res.redirect('/user/login');
           }
           else if(user.isAdmin){
               req.logout();
               return res.redirect('/user/login');
           }
           else{
               return res.redirect('/user/')
           }
        });
    }
    else{
        return res.render('./user/userLogin');
    }
}

module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/user/')
    }
    return res.render('./user/userSignUp');
}

module.exports.profile = async function(req,res){

    try{
        let profileUser = await User.findById(req.user._id)
        .populate('account');

        return res.render('./user/userProfile',{
            profileUser:profileUser
        });
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.home = async function(req,res){
    try{
        let announcement = await Announcement.find({}).sort('-createdAt');
        return res.render('./user/home',{
            announcements:announcement
        });
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.create = async function(req,res){
    try{
        let user = await User.findOne({email:req.body.email});
        if(user||!req.body.isAdmin.localeCompare("true")){
            return res.redirect('/user/signup');
        }
        else{
            await User.create(req.body);
            return res.redirect('/user/login');
        }
    }catch(err){
        console.log('Error',err);
        return res.redirect('/user/signup');
    }
}

//sign in and create a session for the user
module.exports.createSession = function(req,res){
    req.flash('success','Logged In Successfully');
    return res.redirect('/user/profile');
}

//sign out the currently signed in user
module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','Logged out Successfully');
    return res.redirect('/user/');
}

module.exports.contact = function(req,res){
    return res.render('./user/contact');
}

module.exports.branches = function(req,res){
    return res.render('./user/branches');
}

module.exports.faq = function(req,res){
    return res.render('./user/faq');
}

module.exports.personalise = function(req,res){

    User.findById(req.user._id)
    .populate('account')
    .exec(function(err,user){
        if(err){
            console.log('Error in finding the user',err);
            return;
        }
        else{
            return res.render('./user/personalise',{
                user:user
            });
        }
    });
}

module.exports.transferFunds = function(req,res){
    return res.render('./user/transferFunds');
}

module.exports.createAccount = async function(req,res){
   try{
       let user = await User.findById(req.body.user);
       if(!user){
            console.log('User not found');
            return res.redirect('back');
        }
        else if(user.account){
            console.log('User already has an account');
            return res.redirect('back');
        }
        else{
            let account = await Account.create(req.body);
            account.balance=0;
            account.ifscCode=branchToIFSC[account.branch];
            account.save();
            user.account=account;
            user.save();
            return res.redirect('back');
        }
   }catch(err){
        console.log('Error',err);
        return res.redirect('back');
   }
}

module.exports.notifications = async function(req,res){
    try{
        let user = await User.findById(req.user._id)
        .populate({
            path:'notifications',
            options:{
                sort:{createdAt:-1}
            }
        });
        return res.render('./user/notifications',{
            notifications:user.notifications
        });
    }catch(err){
        console.log('Error',err);
    }
}

module.exports.destroyNotification = async function(req,res){
    try{
        let notification = await Notifications.findById(req.params.id);
        if(notification){
            if(notification.user!=req.user.id){
                return res.redirect('back');
            }
            else{
                let userId = notification.user;
                notification.remove();
                await User.findByIdAndUpdate(userId,{$pull:{notifications:req.params.id}});
                return res.redirect('back');
            }
        }
        else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.services = function(req,res){
    return res.render('./user/services');
} 

module.exports.loans = function(req,res){
    User.findById(req.user._id)
    .populate('loans')
    .exec(function(err,user){
        if(err){
            console.log('Error in finding the user',err);
            return;
        }
        else{
            return res.render('./user/loans',{
                profileUser:user
            });
        }
    });
}