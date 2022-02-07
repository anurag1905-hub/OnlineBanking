const { getMaxListeners } = require('gulp');
const nodeMailer = require('../config/nodemailer');

module.exports.sendMessage = function(message){
    let htmlString = nodeMailer.renderTemplate({message:message},'/adminMailer/email_Admin.ejs');

    nodeMailer.transporter.sendMail({
       from:'dummyemail584@gmail.com',
       to:'anuragharsh626@gmail.com',
       subject:"Message",
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