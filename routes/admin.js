const express = require('express');
const passport = require('passport');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/admin/adminLogin'}
),adminController.createSession);

router.get('/announcements',passport.checkAdminAuthentication,adminController.announcements);
router.get('/adminLogin',adminController.adminLogin);
router.get('/destroySession',passport.checkAdminAuthentication,adminController.destroySession);
router.post('/addAnnouncement',passport.checkAdminAuthentication,adminController.addAnnouncement);
router.get('/deleteAnnouncement/:id',passport.checkAdminAuthentication,adminController.deleteAnnouncement);
router.get('/admins',passport.checkAdminAuthentication,adminController.admins);
router.post('/addAdmin',passport.checkAdminAuthentication,adminController.addAdmin);
router.get('/removeAdmin/:id',passport.checkAdminAuthentication,adminController.removeAdmin);
router.get('/viewAccountDetails',passport.checkAdminAuthentication,adminController.viewAccountDetails);
router.post('/showDetails',passport.checkAdminAuthentication,adminController.showDetails);
router.get('/loanRequests',passport.checkAdminAuthentication,adminController.loanRequests);
router.get('/approveLoan',passport.checkAdminAuthentication,adminController.approveLoan);
router.get('/rejectLoan',passport.checkAdminAuthentication,adminController.rejectLoan);
router.get('/pendingLoanPayments',passport.checkAdminAuthentication,adminController.pendingLoanPayments);
router.get('/neftTransactions',passport.checkAdminAuthentication,adminController.neftTransactions);
router.get('/rejectTransaction',passport.checkAdminAuthentication,adminController.rejectTransaction);
router.get('/approveTransaction',passport.checkAdminAuthentication,adminController.approveTransaction);
router.get('/sendPaymentNotification',passport.checkAdminAuthentication,adminController.sendPaymentNotification);


router.get('*',function(req,res){
    return res.render('notification-template',{
       message:"Not Found!"
    });
});

module.exports = router;