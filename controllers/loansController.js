const Notifications = require('../models/notification');
const User = require('../models/user');

module.exports.apply = async function(req,res){
    let user = await User.findById(req.body.user).populate('account');
    if(!user||user.id!=req.user._id||user.account.id!=req.body.accountNumber||user.password!=req.body.password){
        req.flash('error','Unauthorized');
        return res.redirect('back');
    }
    let message = "Your application for "+req.body.type+" has been received and will be processed shortly.";
    await Notifications.create({
        content:message,
        user:user
    });
    req.flash('success','Applied Successfully'); 
    return res.redirect('back');
}