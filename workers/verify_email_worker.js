const queue = require('../config/kue');

const verifyEmailWorker = require('../mailers/emailVerification_mailer');

queue.process('verifyEmail',function(job,done){
    console.log('reset password worker is processing a job',job.data);
 
    verifyEmailWorker.verify(job.data);
 
    done();
 });