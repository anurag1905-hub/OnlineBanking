module.exports.login = function(req,res){
    return res.render('userLogin');
}

module.exports.signup = function(req,res){
    return res.render('userSignUp');
}

module.exports.home = function(req,res){
    return res.render('home');
}
