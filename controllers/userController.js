const User = require('../models/user');

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
    return res.render('userProfile');
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