const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
    text : String,
    hashtag : Array,
    date : Date,
    likecount : Number,
    userId : { type : mongoose.Schema.Types.ObjectId, ref : 'Users' }
});

const Messages = mongoose.model('Messages', messagesSchema);

module.exports = Messages;