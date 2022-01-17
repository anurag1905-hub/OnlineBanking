const mongoose = require('mongoose');

const notificationsSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
});

const Notification = mongoose.model('Notification',notificationsSchema);

module.exports = Notification;