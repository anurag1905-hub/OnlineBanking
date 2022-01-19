const User = require('../models/user');
const Transaction = require('../models/transaction');

module.exports.depositFunds = async function(req,res){
    try{
        let user = await User.findById(req.user._id);
        if(!user||!user.account){
            return res.redirect('/user/profile');
        }
        else{
            return res.render('depositFunds',{
                profileUser:user
            });
        }
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.withdrawFunds = async function(req,res){
    try{
        let user = await User.findById(req.user._id);
        if(!user||!user.account){
            return res.redirect('/user/profile');
        }
        else{
            return res.render('withdrawFunds',{
                profileUser:user
            });
        }
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.miniStatement = async function(req,res){
    try{
        let user = await User.findById(req.user._id)
        .populate('account')
        .populate({
            path:'transactions',
            perDocumentLimit:10,    //show only 10 recent transactions
            options:{
                sort: { createdAt: -1},
            }
        });
        if(!user||!user.account){
            return res.redirect('/user/profile');
        }
        const date = new Date();
        return res.render('miniStatement',{
            transactions:user.transactions,
            date:date
        });
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

