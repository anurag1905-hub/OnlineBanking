const Notifications = require('../models/notification');
const User = require('../models/user');
const Loan = require('../models/loan');

module.exports.apply = async function(req,res){
    try{
        let user = await User.findById(req.body.user)
        .populate('account')
        .populate('loans');
        if(!user||user.id!=req.user._id||user.account.id!=req.body.account||user.password!=req.body.password){
            req.flash('error','Unauthorized');
            return res.redirect('back');
        }
        for(let i=0;i<user.loans.length;++i){
            if(user.loans[i].loantype==req.body.loantype){
                req.flash('error','Not Allowed');
                return res.redirect('back');
            }
        }
        let loan = await Loan.create(req.body);
        user.loans.push(loan);
        user.save();
        let message = "Your application for "+req.body.loantype+" has been received and will be processed shortly.";
        await Notifications.create({
            content:message,
            user:user
        });
        req.flash('success','Applied Successfully'); 
        return res.redirect('back');
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}