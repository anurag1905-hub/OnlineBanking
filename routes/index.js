const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/',homeController.home);
router.use('/user',require('./user'));
router.use('/admin',require('./admin'));

router.get('*',function(req,res){
    return res.render('notification-template',{
       message:"Not Found!"
    });
});

module.exports = router;