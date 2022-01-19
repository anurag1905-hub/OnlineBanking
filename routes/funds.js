const express = require('express');
const router = express.Router();

const passport = require('passport');

const fundsController = require('../controllers/fundsController');

router.post('/transfer/:id',passport.checkAuthentication,fundsController.transfer);
router.post('/deposit',passport.checkAuthentication,fundsController.deposit);
router.post('/withdraw',passport.checkAuthentication,fundsController.withdraw);

module.exports = router;