const express = require('express');
const port = 9000;
const env = require('./config/environment');
const cookieParser = require('cookie-parser'); // Allows us to read and write to a cookie
const app = express();
require('./config/view-helper')(app);
const db = require('./config/mongoose');
const session = require('express-session'); // to create session cookie and store user information in cookies in an encrypted form.
const passport = require('passport'); // passport uses session-cookies to store the identity of the authenticated user.
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongodb-session')(session);  // Used for storing cookies, otherwies cookies get deleted as soon as server restarts due to limited storage.
const sassMiddleware = require('node-sass-middleware'); // Used to convert sass files to css.
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const path = require('path');
const logger = require('morgan');

if(env.name=='development'){
    app.use(sassMiddleware({
        src:path.join(__dirname,env.asset_path,'scss'),
        dest:path.join(__dirname,env.asset_path,'css'),
        debug:true,  // whatever information we see in the terminal. It helps in debugging.
        outputStyle:'extended',  //use multiple lines.
        prefix:'/css' // place where server should look for css files.
    }));
}

app.use(express.static(env.asset_path));  // to access static files
app.use(express.urlencoded({extended:false}));    // so that we can collect form data and store it in req.body 
app.use(cookieParser());    // set up the cookie parser

app.use(logger(env.morgan.mode,env.morgan.options));

app.set('view engine','ejs');  //set up the view engine
app.set('views','./views');    // specify a folder to look for the views.

// express session is used to store user id in cookies in an encrypted form.
app.use(session({
    name:'OnlineBanking',
    secret:env.session_cookie_key,
    saveUninitialized:false,  // When user is not logged in, don't store extra info in session cookie.
    resave:false,             // Don't save the user's info in session cookie if it has not been changed. 
    cookie:{
        maxAge:(1000*60*100)
    },
    store: new MongoStore({
        uri: `mongodb://localhost:27017/${env.db}`,
        collection: 'mySessions'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

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