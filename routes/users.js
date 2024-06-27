var express = require('express');
var router = express.Router();
const Users = require('../models/users');
const { checkBody }  = require("../modules/checkBody");
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

//rappel app.use('/users', usersRouter) dans app.js donc il faut faire /users/... pour accéder a ces routes
//signup(inscription) d'un utilisateur
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
        .then(data => res.json({ result : true, token : user.token }))
        .catch(error => res.status(400).send(error))
    }
    else {
      res.json({ result : false, error : 'User already exists' });
    }
  });
});

//signing (login) user
router.post('/signin', (req, res) => {
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
