const express = require('express');
const router = express.Router();

const passport = require('passport');

const servicesController = require('../controllers/servicesController');

router.get('/depositFunds',passport.checkAuthentication,servicesController.depositFunds);

module.exports = router;