const User = require('../models/user');

module.exports.dashboard = function(req,res){
    return res.render('./admin/dashboard');
}

module.exports.adminLogin = function(req,res){
    return res.render('./admin/adminLogin');
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
              return res.redirect('/admin/dashboard');
          }
      }
    });
}