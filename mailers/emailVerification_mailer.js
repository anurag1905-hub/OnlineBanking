const nodeMailer = require('../config/nodemailer');

module.exports.verify = function(verifyEmail){
    let htmlString = nodeMailer.renderTemplate({verifyEmail:verifyEmail},'/emailVerifier/verifyEmail.ejs');

    nodeMailer.transporter.sendMail({
       from:'dummyemail584@gmail.com',
       to:verifyEmail.email,
       subject:"Verify Your Email",
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