const mongoose = require('mongoose');

const notificationsSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    time:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const Notifications = mongoose.model('Notifications',notificationsSchema);

module.exports = Notifications;