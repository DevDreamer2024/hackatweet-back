var express = require('express');
var router = express.Router();
import Users from '../models/users';
import Messages from '../models/messages';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//route test signup user a essayer
router.post('/signup', function(req, res, next) {
  const user = new Users({
    profilepic : req.body.profilepic,
    firstname : req.body.firstname,
    username : req.body.username,
    token : req.body.token,
    password : req.body.password,
  });
  user.save()
    .then(() => res.send('User saved'))
    .catch(error => res.status);
});

//route test message a essayer

router.post('/message', function(req, res, next) {
  const message = new Messages({
    text : req.body.text,
    hashtag : req.body.hashtag,
    date : new Date(),
    likecount : req.body.likecount,
    auteur : {
        profilepic : req.body.profilepic,
        firstname : req.body.firstname,
        username : req.body.username,
    }
  });
  message.save()
    .then(() => res.send('Message saved'))
    .catch(error => res.status);
});





module.exports = router;
