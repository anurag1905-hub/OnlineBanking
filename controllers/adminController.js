const User = require('../models/user');
const Announcement = require('../models/announcement');

module.exports.dashboard = async function(req,res){
    try{
        let announcement = await Announcement.find({}).sort('-createdAt');
        return res.render('./admin/dashboard',{
            announcements:announcement
        });
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
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

module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','Logged out Successfully');
    return res.redirect('/admin/adminLogin');
}

module.exports.addAnnouncement = function(req,res){
   Announcement.create(req.body,function(err,announcement){
      if(err){
          console.log('Error',err);
          return res.redirect('back');
      }
      else{
        return res.redirect('/admin/dashboard');
      }
   });
}

module.exports.deleteAnnouncement = function(req,res){
    Announcement.findByIdAndDelete(req.params.id,function(err){
       if(err){
           return res.redirect('back');
       }
       else{
           return res.redirect('/admin/dashboard');
       }
    });
}