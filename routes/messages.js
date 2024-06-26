var express = require("express");
var router = express.Router();
const Messages = require("../models/messages");

//rappel : app.use('/messages', messagesRouter) dans app.js donc il faut faire /messages/... pour accéder a ces routes
//ajouter un nouveau message a essayer
router.post("/", function (req, res) {
  if (req.body.text === undefined || req.body.userId === undefined) {
    res.status(400).send("Missing parameters");
    return;
  }
  const hashtag = req.body.text.match(/#[a-z]+/gi); //regex pour trouver les hashtags directement dans le texte, hashtag est un array dans le schema
  const message = new Messages({
    text: req.body.text,
    hashtag: hashtag,
    date: Date.now(),
    likecount: 0,
    userId: req.body.userId,
  });
  message
    .save() //le populate renvoi tout sauf id et password
    .then(() =>
      Messages.find()
        .populate({
          path: "userId",
          select: "-_id -password",
        })
        .then((messages) => res.send(messages))
    )
    .catch((error) => res.status(400).send(error));
});

//obtenir tout les messages
router.get("/", function (req, res) {
  Messages.find()
    .populate({
      path: "userId",
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
      path: "userId",
      select: "-_id -password",
    })
    .then((messages) => res.send(messages))
    .catch((error) => res.status(400).send(error));
});

//route test pour trouver tout les messages d'un utilisateur (messages/id)
router.get("/messages/:id", function (req, res) {
  Messages.find({ userId: req.params.id })
    .populate({
      path: "userId",
      select: "-_id -password",
    })
    .then((messages) => res.send(messages))
    .catch((error) => res.status(400).send(error));
});

//supprimer un message
router.delete("/message/:id", function (req, res) {
  Messages.findByIdAndDelete(req.params.id)
    .then(() =>
      Messages.find()
        .populate({
          path: "userId",
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
