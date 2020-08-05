const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.addLike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      console.log(sauce);
      console.log(req.body);

      usersLiked = sauce.usersLiked; // Récupére le champ usersLiked dans la BDD qui va donner un array
      usersDisliked = sauce.usersDisliked;
      userId = req.body.userId; // On récupère l'UserId de la personne qui a cliqué sur j'aime

      switch (req.body.like) {
        case 1 : // L'utilisateur aime la sauce
            sauce.likes++; // Récupérer la valeur du champ likes et on ajoute 1.
            sauce.usersLiked.push(userId); // On push dans ce array l'ID de l'utilisateur qui a cliqué s'il n'est pas déjà présent
          break;
        case 0: // L'utilisateur enlève le choix qu'il a fait
          if ((sauce.usersLiked.includes(userId))){ // Si l'id de l'user est dans le tableau des users qui aime la sauce
            sauce.likes--; // On enlève un au nombre de personne qui aime la sauce.
            sauce.usersLiked = sauce.usersLiked.filter(userLiked => userLiked !== userId); // On enlève l'userId du tableau
          }
          if ((sauce.usersDisliked.includes(userId))){ // Si l'userId est dans usersDisliked[]
            sauce.dislikes--; // Récupérer la valeur du champ dislikes et on retire 1
            sauce.usersDisliked = sauce.usersDisliked.filter(userDisliked => userDisliked !== userId); // On enlève l'userId du tableau
          }
          break;
        case -1 : // L'utilisateur n'aime pas la sauce
            sauce.dislikes++; // Récupérer la valeur du champ dislikes et on retire 1
            sauce.usersDisliked.push(userId); // On l'ajoute au tableau des users qui n'aiment pas la sauce.
        break;
      }
      sauce.save() // On sauvegarde la sauce modifiée dans la base de données 
      .then(() => res.status(201).json({ message: 'Choix enregistré !'}))
      .catch(error => res.status(400).json({ error }));
    }
      )
    .catch(error => res.status(404).json({ error }));
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // console.log(sauceObject);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject, // Récupération du corps de sauce dans la requête et on l'affece au nouvel objet Sauce
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // ***
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
      };

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
      };