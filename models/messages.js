const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
    text : String,
    hashtag : String,
    date : new Date(),
    likecount : Number,
    auteur : {
        profilepic : String,
        firstname : String,
        username : String,
    }
});

const Messages = mongoose.model('Messages', messagesSchema);

module.exports = Messages;