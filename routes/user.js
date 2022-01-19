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

module.exports = router;