const jwt = require('jsonwebtoken');

// Vérifie que le token est valable et que l'userId qui est encodé dans le token correspond à celui de la requête.
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Récupération du token dans les headers de la requête
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // On décode le token
    const userId = decodedToken.userId; // Une fois décodé, on peut récupérer l'userId qui est dans le token
    if (req.body.userId && req.body.userId !== userId) { // S'il n'y a pas d'userId dans la requête ou si l'userId de la requête est différent de celui du token
      throw 'Invalid user ID'; // On renvoie dans le bloc catch
    } else {
      next(); // Si tout est ok, on passe la requête au prochain middlewaere
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};