const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/userController');
const loanController = require('../controllers/loansController');

router.get('/',passport.checkAuthentication,userController.loans);
router.post('/apply',passport.checkAuthentication,loanController.apply);

module.exports = router;
