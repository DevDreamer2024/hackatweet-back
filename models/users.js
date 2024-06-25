const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    profilepic : { type : String, default : "/public/images/egg.jpg"},
    firstname : String,
    username : String,
    token : String,
    password : String,
});

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;