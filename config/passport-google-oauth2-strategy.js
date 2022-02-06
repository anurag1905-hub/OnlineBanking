const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');  // Used for generating random passwords.
const User = require('../models/user');
const env = require('./environment');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID:env.google_client_ID,
    clientSecret:env.google_client_Secret,
    callbackURL:env.google_callback_URL,
},

function(accessToken,refreshToken,profile,done){
   //find a user
   User.findOne({email:profile.emails[0].value}).exec(function(err,user){
      if(err){
          console.log('Error in google strategy-passport',err);
          return;
      }
      if(user){
          // if found, set this user as req.user
          return done(null,user);
      }
      else{
          //if not found, create the user and set it as req.user
          User.create({
              name:profile.displayName,
              email:profile.emails[0].value,
              password:crypto.randomBytes(20).toString('hex'),
              isAdmin:false
          },function(err,user){
                if(err){
                    console.log('Error in creating user',err);
                    return;
                }
                else{
                    return done(null,user);
                }
          });
      }
   });
}
));

module.exports = passport;