var express = require('express');
var router = express.Router();
import Messages from '../models/messages';
import Users from '../models/users';


//route test ajouter un nouveau message a essayer
router.post('/message', function(req, res) {
    const message = new Messages({
      text : req.body.text,
      hashtag : req.body.hashtag,
      date : new Date(),
      likecount : req.body.likecount,
      auteur : req.body.userId,
    });
    message.save()
      .then(() => Messages.find().populate('auteur')
      .then(messages => res.send(messages)))
      .catch(error => res.status(400).send(error));
      });
  