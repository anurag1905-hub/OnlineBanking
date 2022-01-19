const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/Notification/:id',passport.checkAuthentication,userController.destroyNotification);

module.exports = router;