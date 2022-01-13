const User = require('../models/user');

module.exports.login = function(req,res){
    return res.render('userLogin');
}

module.exports.signup = function(req,res){
    return res.render('userSignUp');
}

module.exports.home = function(req,res){
    return res.render('home');
}

module.exports.create = function(req,res){
   console.log(req.body.isAdmin);
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
