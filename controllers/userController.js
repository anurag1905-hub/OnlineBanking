const User = require('../models/user');
const Account = require('../models/account');
const Notifications = require('../models/notification');
const Announcement = require('../models/announcement');
const jwt = require('jsonwebtoken');
const resetPassword = require('../models/reset-password');
const passwordsMailer = require('../mailers/passwords_mailer');

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
        console.log(profileUser);

        let unreadNotifications = profileUser.notifications.length-profileUser.lastCount;
        
        return res.render('./user/userProfile',{
            profileUser:profileUser,
            unreadNotifications:unreadNotifications
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

module.exports.settings = async function(req,res){

    try{
        let user = await User.findById(req.user._id)
        .populate('account');

        let unreadNotifications = user.notifications.length-user.lastCount;
        
        return res.render('./user/settings',{
            user:user,
            unreadNotifications:unreadNotifications
        });
    }catch(err){
        console.log('Error',err);
        req.flash('error','Error');
        return res.redirect('/user/profile');
    }
    
}

module.exports.transferFunds = function(req,res){
    User.findById(req.user._id,function(err,user){
        if(err){
            return res.redirect('back');
        }
        else{
            let unreadNotifications = user.notifications.length-user.lastCount;
            return res.render('./user/transferFunds',{
                unreadNotifications:unreadNotifications
            });
        }
    });
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
        user.lastCount = user.notifications.length;
        user.save();
        return res.render('./user/notifications',{
            notifications:user.notifications
        });
    }catch(err){
        console.log('Error',err);
        return res.redirect('/user/profile')
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

                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            notification:notification
                        },
                        message:"Notification Deleted"
                    });
                }

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
            let unreadNotifications = user.notifications.length-user.lastCount;
            return res.render('./user/loans',{
                profileUser:user,
                unreadNotifications:unreadNotifications
            });
        }
    });
}

module.exports.updateLoginInfo = async function(req,res){
    try{
        let user = await User.findById(req.user._id);
        user.email=req.body.email;
        user.password=req.body.password;
        user.save();
        req.flash('success','Updated Successfully');
        return res.redirect('/user/settings');
    }catch(err){
        req.flash('error','Error');
        console.log('Error',err);
        return res.redirect('/user/settings');
    }
}

module.exports.updateAccountInfo = async function(req,res){
    try{
        let accountId = req.params.id;
        let account = await Account.findById(accountId);
        if(!account){
            req.flash('error','Unauthorized');
            return res.redirect('/user/settings');
        }
        
        //.id means converting the object id into string.
        //when we are comparing two object ids both of them should be in strings.
        if(account.user!=req.user.id){
            req.flash('error','user mismatch');
            return res.redirect('/user/settings');
        }
        account.phone = req.body.phone;
        account.address = req.body.address;
        account.email = req.body.email;

        account.save();

        req.flash('success','Updated Successfully');
        return res.redirect('/user/settings');
    }catch(err){
        req.flash('error','Error');
        console.log('Error',err);
        return res.redirect('/user/settings');
    }
    
}

module.exports.reset = function(req,res){
    return res.render('reset-password');
}

module.exports.sendResetLink = async function(req,res){
    try{
        let user = await User.findOne({email:req.body.email});
        if(!user){
            console.log('User not found!');
            return res.redirect('back');
        }
        let reset_password = await resetPassword.create({
            user: user._id,
            accesstoken: jwt.sign(user.toJSON(),'OnlineBanking',{expiresIn:'10000000'}),
            isValid: true
        });
        let reset_Password = await resetPassword.findById(reset_password._id).populate('user');
        passwordsMailer.reset(reset_Password);
        return res.end('A link to reset password has been sent to your email account');
    }catch(err){
        console.log('Unable to send reset Password link',err);
        return res.redirect('back');
    }
}

module.exports.resetPassword = async function(req,res){
    try{
        let accessToken = req.params.token;
        let user_account = await resetPassword.findOne({accesstoken:accessToken});
        if(user_account){
            return res.render('changePassword',{
                token:accessToken
            });
        }
        else{
            return res.end('Invalid or expired token');
        }
    }catch(err){
        console.log('Error while resetting password',err);
        return res.redirect('/user/login');
    }
}

module.exports.changePassword = async function(req,res){
    let password = req.body.password;
    let confirm_password = req.body.confirmPassword;
    //console.log(req.body);
    if(password!=confirm_password){
        //console.log(password);
        //console.log(confirm_password);
        return res.redirect('back');
    }
    let accessToken = req.params.token;
    let user_account = await resetPassword.findOne({accesstoken:accessToken});
    //console.log(user_account.isValid);
    if(user_account&&user_account.isValid==true){
        let user = await User.findById(user_account.user);
        //console.log(user);
        if(user){
            user.password = password;
            user.save();
            user_account.isValid=false;
            user_account.save();
            //console.log(user_account.isValid);
            return res.redirect('/user/login');
        }
        else{
            console.log('Could not find the user');
            return res.redirect('back');
        }
    }
    else{
         return res.send('Invalid or Expired Token');
    }
}

module.exports.contactMessage = function(req,res){
    return res.redirect('back');
}
