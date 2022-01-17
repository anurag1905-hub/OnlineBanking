const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/transaction/:id',passport.checkAuthentication,userController.destroytransaction);

module.exports = router;