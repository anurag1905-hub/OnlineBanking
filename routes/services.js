const express = require('express');
const router = express.Router();

const passport = require('passport');

const servicesController = require('../controllers/servicesController');

router.get('/depositFunds',passport.checkAuthentication,servicesController.depositFunds);
router.get('/withdrawFunds',passport.checkAuthentication,servicesController.withdrawFunds);
router.get('/miniStatement',passport.checkAuthentication,servicesController.miniStatement);
router.get('/accountStatement',passport.checkAuthentication,servicesController.accountStatement);
router.post('/getaccountStatement',passport.checkAuthentication,servicesController.showaccountStatement);


module.exports = router;