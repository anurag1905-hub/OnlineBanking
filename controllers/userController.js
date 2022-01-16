const User = require('../models/user');
const Account = require('../models/account');

module.exports.login = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/user/')
    }
    return res.render('userLogin');
}

module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/user/')
    }
    return res.render('userSignUp');
}

module.exports.profile = function(req,res){

    User.findById(req.user._id)
    .populate('account')
    .exec(function(err,user){
        if(err){
            console.log('Error in finding the error',err);
            return;
        }
        else{
            return res.render('userProfile',{
                user:user
            });
        }
    });
}

module.exports.home = function(req,res){
    if(req.isAuthenticated()){
        User.findById(req.user,function(err,user){
           if(err){
               return res.redirect('/user/login');
           }
           else{
               return res.render('home',{
                   user:user
               });
           }
        });
    }
    else{
        return res.render('home');
    }
}

module.exports.create = function(req,res){
   User.findOne({email:req.body.email},function(err,user){
      if(err){
          console.log('Error in finding the user ',err);
          return res.redirect('back');
      }
      if(user||req.body.isAdmin){
          return res.redirect('back');
      }
      else{
          User.create(req.body,function(err,user){
             if(err){
                 console.log('Error in creating the user ',err);
                 return res.redirect('back');
             }
             else{
                 return res.redirect('/user/login');
             }
          });
      }
   });
}

//sign in and create a session for the user
module.exports.createSession = function(req,res){
    return res.redirect('/user/profile');
}

//sign out the currently signed in user
module.exports.destroySession = function(req,res){
    req.logout();
    return res.redirect('/user/');
}

module.exports.contact = function(req,res){
    return res.render('contact');
}

module.exports.branches = function(req,res){
    return res.render('branches');
}

module.exports.faq = function(req,res){
    return res.render('faq');
}

module.exports.personalise = function(req,res){
    return res.render('personalise');
}

module.exports.transferFunds = function(req,res){
    return res.render('transferFunds');
}

module.exports.createAccount = function(req,res){
   User.findById(req.body.user,function(err,user){
       if(err){
           console.log('Error in finding the user',err);
           return;
       }
       else if(!user){
           console.log('User not found');
           return res.redirect('back');
       }
       else if(user.account){
           console.log('User already has an account');
           return res.redirect('back');
       }
       else{
           Account.create(req.body,function(err,account){
               if(err){
                   console.log('Error in creating the account ',err);
                   return;
               }
               else{
                   account.balance=0;
                   account.save();
                   user.account=account;
                   user.save();
                   return res.redirect('back');
               }
           });
       }
   });
}