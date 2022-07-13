const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
require('dotenv').config();

const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory)||fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
  interval:'1d',
  path:logDirectory
});

const development = {
    name:'development',
    asset_path:'assets',
    session_cookie_key:'WebDevelopment',
    db:'clients',
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:'',
            pass:''
        }
    },
    google_client_ID:"791695523309-gb6p0fv7peuah0gf216tfrg8sltpnkb8.apps.googleusercontent.com",
    google_client_Secret:"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",
    google_callback_URL:"http://localhost:9000/user/auth/google/callback",
    jwt_secret:'OnlineBanking',
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    }
}

const production = {
    name:process.env.BANKING_ENVIRONMENT,
    asset_path:process.env.BANKING_ASSET_PATH,
    session_cookie_key:process.env.BANKING_SESSION_COOKIE_KEY,
    db:process.env.BANKING_DB,
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:process.env.BANKING_GMAIL_USERNAME,
            pass:process.env.BANKING_GMAIL_PASSWORD
        }
    },
    google_client_ID:process.env.BANKING_GOOGLE_CLIENT_ID,
    google_client_Secret:process.env.BANKING_GOOGLE_CLIENT_SECRET,
    google_callback_URL:process.env.BANKING_GOOGLE_CALLBACK_URL,
    jwt_secret:process.env.BANKING_JWT_SECRET,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    }
}

module.exports = development;