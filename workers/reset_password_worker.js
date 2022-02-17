const queue = require('../config/kue');

const resetPasswordMailer = require('../mailers/passwords_mailer');

queue.process('resetPassword',function(job,done){
    console.log('reset password worker is processing a job',job.data);
 
    resetPasswordMailer.reset(job.data);
 
    done();
 });