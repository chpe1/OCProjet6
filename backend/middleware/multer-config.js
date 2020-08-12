// configuration de multer qui permet de gérer les fichiers envoyées à l'API
const multer = require('multer');

const MIME_TYPES = { // Liste des extensions envoyées par le frontend
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // diskStorage permet d'enregistrer l'image sur le disque
  destination: (req, file, callback) => {
    callback(null, 'images');   // null car pas d'erreur à ce niveau là, 'images' est le nom du dossier ds lequel le fichier va 
                                //être téléchargé
  },
  filename: (req, file, callback) => { // Création du nom du fichier
    const name = file.originalname.split(' ').join('_'); // Nom d'origine du fichier en remplaçant les espaces par des _
    const extension = MIME_TYPES[file.mimetype]; // On applique une extension au fichier qu'on retrouve dans le MIME TYPE du fichier envoyé
    callback(null, name + Date.now() + '.' + extension); // Création du nom du fichier -- null car pas d'erreur
  }
});

// On exporte le middleware en passant l'objet storage (l'image reçue et modifiée) en paramètre en lui indiquant 
//qu'il s'agit d'un simple fichier image
module.exports = multer({storage: storage}).single('image');