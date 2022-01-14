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
router.get('/contact',userController.contact);

module.exports = router;