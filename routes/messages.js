var express = require('express');
var router = express.Router();
const Messages = require('../models/messages');


//dans cette partie il faut : obtenir tout les messages, obtenir un message par son hashtag,  ajouter un nouveau message, supprimer un message, ajouter un like a un message, supprimer un like a un message
//route test ajouter un nouveau message a essayer
router.post('/message', function(req, res) {
    if(req.body.text === undefined || req.body.hashtag === undefined || req.body.userId === undefined) {
      res.status(400).send('Missing parameters');
      return;
    }
    const message = new Messages({
      text : req.body.text,
      hashtag : req.body.hashtag,
      date : Date.now(),
      likecount : 0,
      userId : req.body.userId,
    });
    message.save()  //le populate renvoi l'intégralité des elements de l'user token et mdp inclu
      .then(() => Messages.find().populate('userId')
      .then(messages => res.send(messages)))
      .catch(error => res.status(400).send(error));
      });
  
  //route test obtenir tout les messages a essayer
  router.get('/messages', function(req, res) {
    Messages.find().populate('userId')
      .then(messages => res.send(messages))
      .catch(error => res.status(400).send(error));
  });

  //route test obtenir un message par son hashtag a essayer
  router.get('/message/:hashtag', function(req, res) {
    Messages.find({ hashtag: req.params.hashtag }).populate('userId')
      .then(messages => res.send(messages))
      .catch(error => res.status(400).send(error));
  });

  //route test pour trouver tout les messages d'un utilisateur
  router.get('/messages/:id', function(req, res) {
    Messages.find({ userId: req.params.id }).populate('userId')
      .then(messages => res.send(messages))
      .catch(error => res.status(400).send(error));
  });

  //route test supprimer un message a essayer
  router.delete('/message/:id', function(req, res) {
    Messages.findByIdAndDelete(req.params.id)
      .then(() => Messages.find().populate('userId')
      .then(messages => res.send(messages)))
      .catch(error => res.status(400).send(error));
  });
  //route test ajouter un like a un message a essayer
  router.put('/like/:id', function(req, res) {
    const id = req.params.id;
    Messages.findOneAndUpdate({ _id: id }, { $inc: { likecount: 1 } }, { new: true })
      .then(data => res.send(data))
      .catch(error => res.status(400).send(error));
  });
  //route test supprimer un like a un message a essayer
  router.put('/dislike/:id', function(req, res) {
    const id = req.params.id;
    Messages.findOneAndUpdate({ _id: id }, { $inc: { likecount: -1 } }, { new: true })
      .then(data => res.send(data))
      .catch(error => res.status(400).send(error));
  });


module.exports = router;