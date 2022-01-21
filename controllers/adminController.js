const User = require('../models/user');
const Announcement = require('../models/announcement');

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
              return res.redirect('/admin/announcements');
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