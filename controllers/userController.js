const User = require('../models/user');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

const branchToIFSC={
    "Eastern":"TOB00001234",
    "Western":"TOB00002345",
    "Northern":"TOB00003456",
    "Southern":"TOB00004567"
};

module.exports.login = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/user/')
    }
    return res.render('userLogin');
}

module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/user/')
    }
    return res.render('userSignUp');
}

module.exports.profile = async function(req,res){

    try{
        let profileUser = await User.findById(req.user._id)
        .populate('account');

        return res.render('userProfile',{
            profileUser:profileUser
        });
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.home =  function(req,res){
    return res.render('home');
}

module.exports.create = async function(req,res){
    try{
        let user = await User.findOne({email:req.body.email});
        if(user||!req.body.isAdmin.localeCompare("true")){
            return res.redirect('/user/signup');
        }
        else{
            await User.create(req.body);
            return res.redirect('/user/login');
        }
    }catch(err){
        console.log('Error',err);
        return res.redirect('/user/signup');
    }
}

//sign in and create a session for the user
module.exports.createSession = function(req,res){
    return res.redirect('/user/profile');
}

//sign out the currently signed in user
module.exports.destroySession = function(req,res){
    req.logout();
    return res.redirect('/user/');
}

module.exports.contact = function(req,res){
    return res.render('contact');
}

module.exports.branches = function(req,res){
    return res.render('branches');
}

module.exports.faq = function(req,res){
    return res.render('faq');
}

module.exports.personalise = function(req,res){

    User.findById(req.user._id)
    .populate('account')
    .exec(function(err,user){
        if(err){
            console.log('Error in finding the error',err);
            return;
        }
        else{
            return res.render('personalise',{
                user:user
            });
        }
    });
}

module.exports.transferFunds = function(req,res){
    return res.render('transferFunds');
}

module.exports.createAccount = async function(req,res){
   try{
       let user = await User.findById(req.body.user);
       if(!user){
            console.log('User not found');
            return res.redirect('back');
        }
        else if(user.account){
            console.log('User already has an account');
            return res.redirect('back');
        }
        else{
            let account = await Account.create(req.body);
            account.balance=0;
            account.ifscCode=branchToIFSC[account.branch];
            account.save();
            user.account=account;
            user.save();
            return res.redirect('back');
        }
   }catch(err){
        console.log('Error',err);
        return res.redirect('back');
   }
}

module.exports.transactions = async function(req,res){
    try{
        let transaction = await Transaction.find({user:req.user._id});
        return res.render('transactions',{
            transactions:transaction
        });
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.destroytransaction = async function(req,res){
    try{
        let transaction = await Transaction.findById(req.params.id);
        if(transaction){
            if(transaction.user!=req.user.id){
                return res.redirect('back');
            }
            else{
                transaction.remove();
                return res.redirect('back');
            }
        }
        else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}

module.exports.services = function(req,res){
    return res.render('services');
} 