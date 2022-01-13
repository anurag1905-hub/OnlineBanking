const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login',userController.login);
router.get('/signup',userController.signup);
router.get('/',userController.home);
router.post('/create',userController.create);

module.exports = router;