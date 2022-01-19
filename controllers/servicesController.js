const User = require('../models/user');
const Transaction = require('../models/transaction');

const month=["January","February","March","April","May","June","July","August","September","October","November","December"];

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
    if(!user||!user.account){
        return res.redirect('back');
    }
    else{
        return res.render('withdrawFunds',{
            profileUser:user
        });
    }
}

module.exports.miniStatement = async function(req,res){
    let user = await User.findById(req.user._id).populate('account');
    if(!user||!user.account){
        return res.redirect('back');
    }
    const date = new Date();
    //Only show 10 recent transactions.
    let transaction = await Transaction.find({user:user._id}).limit(10);
    return res.render('miniStatement',{
        transactions:transaction,
        date:date
    });
}

