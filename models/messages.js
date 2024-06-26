const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
    text : String,
    hashtag : Array,
    date : Date,
    likecount : Number,
    userToken: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    likedBy : Array,
});

const Messages = mongoose.model('Messages', messagesSchema);

module.exports = Messages;