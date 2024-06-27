var express = require("express");
var router = express.Router();
const Messages = require("../models/messages");
const Users = require("../models/users");
//rappel : app.use('/messages', messagesRouter) dans app.js donc il faut faire /messages/... pour accéder a ces routes
//ajouter un nouveau message a essayer
router.post("/", function (req, res) {
  console.log(req.body);
  if (req.body.text === undefined || req.body.userToken === undefined) {
    res.status(400).send("Missing parameters");
    return;
  }
  const hashtag = req.body.text.match(/#[a-z]+/gi); // regex pour trouver les hashtags directement dans le texte, hashtag est un array dans le schema

  Users.findOne({ token: req.body.userToken }).then((user) => {
    if (!user) {
      res.status(400).send("User not found");
      return;
    }
    const message = new Messages({
      text: req.body.text,
      hashtag: hashtag,
      date: Date.now(),
      likecount: 0,
      userToken: user._id, // Store the ObjectId of the user
    });
    message
      .save()
      .then(() =>
        Messages.find()
          .populate({
            path: "userToken",
            select: "-_id -password",
          })
          .then((messages) => res.send(messages))
      )
      .catch((error) => res.status(400).send(error));
  }).catch((error) => res.status(500).send(error)); // Add catch block for Users.findOne
});

//obtenir tout les messages
router.get("/", function (req, res) {
  Messages.find()
    .populate({
      path: "userToken",
      select: "-_id -password",
    })
    .then((messages) => res.send(messages))
    .catch((error) => res.status(400).send(error));
});

// obtenir un message par son hashtag (messages/hashtag)
// cela fonctionne mais bien penser a ajouter # devant le req.params.hashtag

router.get("/:hashtag", function (req, res) {
  console.log(req.params.hashtag);
  Messages.find({ hashtag: { $in: [req.params.hashtag] } })
    .populate({
      path: "userToken",
      select: "-_id -password",
    })
    .then((messages) => res.send(messages))
    .catch((error) => res.status(400).send(error));
});


//route test pour trouver tout les messages d'un utilisateur (messages/id)
router.get("/messages/:token", function (req, res) {
  Users.findOne({ token: req.params.token }).then((user) => {
    if (!user) {
      res.status(400).send("User not found");
      return;
    }
    Messages.find({ userToken: user._id })
      .populate({
        path: "userToken",
        select: "-_id -password",
      })
      .then((messages) => res.send(messages))
      .catch((error) => res.status(400).send(error));
  }).catch((error) => res.status(500).send(error)); // Add catch block for Users.findOne
});

//supprimer un message
router.delete("/message/:id", function (req, res) {
  Messages.findByIdAndDelete(req.params.id)
    .then(() =>
      Messages.find()
        .populate({
          path: "userToken",
          select: "-_id -password",
        })
        .then((messages) => res.send(messages))
    )
    .catch((error) => res.status(400).send(error));
});
//
//cette route prend l'id du message et incrémente le likecount de 1
router.put("/like/:id", function (req, res) {
  const id = req.params.id;
  Messages.findOneAndUpdate(
    { _id: id },
    { $inc: { likecount: 1 } },
    { new: true }
  )
    .then((data) => res.send(data))
    .catch((error) => res.status(400).send(error));
});
//route diminuer un like a un message
router.put("/dislike/:id", function (req, res) {
  const id = req.params.id;
  Messages.findOneAndUpdate(
    { _id: id },
    { $inc: { likecount: -1 } },
    { new: true }
  )
    .then((data) => res.send(data))
    .catch((error) => res.status(400).send(error));
});
module.exports = router;
