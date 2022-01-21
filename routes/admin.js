const express = require('express');
const passport = require('passport');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/admin/login'}
),adminController.createSession);

router.get('/dashboard',passport.checkAuthentication,adminController.dashboard);
router.get('/adminLogin',adminController.adminLogin);
router.get('/destroySession',adminController.destroySession);
router.post('/addAnnouncement',adminController.addAnnouncement);
router.get('/deleteAnnouncement/:id',adminController.deleteAnnouncement);

module.exports = router;