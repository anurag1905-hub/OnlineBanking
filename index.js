const express = require('express');
const port = 9000;
const app = express();

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static('assets'));  // to access static files

app.use('/',require('./routes/index'));

app.listen(port,function(err){
    if(err){
        console.log('Error in starting the server ',err);
        return;
    }
    else{
        console.log('Server is running successfully at port no : ',port);
    }
})