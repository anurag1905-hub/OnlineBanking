const User = require('../models/user');

module.exports.depositFunds = async function(req,res){
    let user = await User.findById(req.user._id);
    if(!user){
        return res.redirect('/user/profile');
    }
    else{
        return res.render('depositFunds',{
            profileUser:user
        });
    }
}

module.exports.withdrawFunds = async function(req,res){
    let user = await User.findById(req.user._id);
    if(!user){
        return res.redirect('/user/profile');
    }
    else{
        return res.render('withdrawFunds',{
            profileUser:user
        });
    }
}

