const passport = require('passport');

const localStrategy = require('passport-local');

const User = require('../models/user');

//Authentication using passport
passport.use(new localStrategy(
    {
        usernameField:'email',
        passReqToCallback:true
    },
    function(req,email,password,done){
       //Find a user and establish the identity
       User.findOne({email:email},function(err,user){
         if(err){
             req.flash('error','Error!')
             return done(err);
         }
         if(!user||user.password!=password){
             req.flash('error','Invalid Username/Password');
             return done(null,false);
         }
         return done(null,user);
       });
    }
));

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
   done(null,user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
   User.findById(id,function(err,user){
      if(err){
          console.log('Error in finding the user --->Passport');
          done(err);
      }
      return done(null,user);
   });
});

//check if the user is authenticated
passport.checkAuthentication = function(req,res,next){
    // if the person is signed in, check the person is not an admin then pass on the request to the next function (controller's action).
    if(req.isAuthenticated()){
        User.findById(req.user._id,function(err,user){
            if(err){
                return res.redirect('/user/login');
            }
            else if(user.isAdmin){
                return res.redirect('/user/login');
            }
            else{
                return next();
            }
        });
    }
    else{
        return res.redirect('/user/login');
    }
}

//check if the admin is authenticated
passport.checkAdminAuthentication = function(req,res,next){
   // if the person is signed in, check the person is an admin then pass on the request to the next function (controller's action).
   if(req.isAuthenticated()){
        User.findById(req.user._id,function(err,user){
            if(err){
                return res.redirect('/');
            }
            else if(!user.isAdmin){
                return res.redirect('/');
            }
            else{
                return next();
            }
        });
    }
    else{
        return res.redirect('/admin/adminLogin');
    }
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the sesion cookie. It is handled by passport. And we are just sending this to the locals for the views.
        res.locals.user = req.user;
    }
    next();
}




module.exports = passport;
