const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/clients');

//Connection of mongoose with the database gives us the access to database.
const db = mongoose.connection;

db.on('error',console.error.bind(console,' error connecting to db '));

// If the connection is open for us to interact with the database
db.once('open',function(){
    console.log('Successfully connected to the database');
 });