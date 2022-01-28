const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login',userController.login);
router.get('/signup',userController.signup);
router.get('/',userController.home);
router.post('/create',userController.create);
router.get('/profile',passport.checkAuthentication,userController.profile);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/user/signup'}
),userController.createSession);
router.get('/signout',userController.destroySession);
router.get('/notifications',userController.notifications);
router.get('/contact',userController.contact);
router.get('/branches',userController.branches);
router.get('/faq',userController.faq);
router.get('/personalise',userController.personalise);
router.get('/transferFunds',userController.transferFunds);
router.post('/createAccount',userController.createAccount);
router.use('/funds',require('./funds'));
router.use('/destroy',require('./destroy'));
router.use('/services',require('./services'));
router.use('/loans',require('./loan'));
router.post('/updateLoginInfo',passport.checkAuthentication,userController.updateLoginInfo);
router.post('/updateAccountInfo/:id',passport.checkAuthentication,userController.updateAccountInfo);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/user/login'}),userController.createSession);
router.get('/reset-password',userController.reset);
router.post('/reset-password',userController.sendResetLink);
router.get('/reset-password/:token',userController.resetPassword);
router.post('/changePassword/:token',userController.changePassword);

module.exports = router;