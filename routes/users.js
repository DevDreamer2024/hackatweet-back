var express = require('express');
var router = express.Router();
import Users from '../models/users';
import { checkBody } from '../modules/checkBody';

const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

//route test signup user a essayer
router.post('/signup', function(req, res) {
  Users.findOne({ username: req.body.username}).then(data => {
    if (data === null) {
      const token = uid2(32);
      const hash = bcrypt.hashSync(req.body.password, 10);
      const user = new Users({
        firstname : req.body.firstname,
        username : req.body.username,
        token : token,
        password : hash,
      });
      user.save()
        .then(() => Users.find())
        .then(users => res.send(users))
        .catch(error => res.status(400).send(error))
    }
    else {
      res.status(400).send('User already exists');
    }
  });
});

//route test signing user a essayer

router.post('signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result : false , error : 'Missing parameters' });
    return;
  }
  Users.findOne({ username : req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result : true, token : data.token });
    } else {
      res.json({ result : false, error : 'User not found or invalid credential' });
    }
});
});










module.exports = router;
