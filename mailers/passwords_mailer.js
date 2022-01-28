const nodeMailer = require('../config/nodemailer');

module.exports.reset = function(resetPassword){
    let htmlString = nodeMailer.renderTemplate({resetPassword:resetPassword},'/passwords/resetPassword.ejs');

    nodeMailer.transporter.sendMail({
       from:'',
       to:resetPassword.user.email,
       subject:"Password Reset Email",
       html:htmlString
    },function(err,info){
        if(err){
            console.log('Error in sending email',err);
            return;
        }
        else{
            console.log(info);
            return;
        }
    });
}