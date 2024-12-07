const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {

    const token = req.header('Authorization')?.replace('Bearer ', ''); 
    const JWT_SECRET = 'vaV4RRCQLpV4IgFew1R08QQvet0b716wzP0W24DDgI2tObYdQYMY9fbikHzL1Pfz';
  
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
    }


    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; 
      next(); 
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide ou expiré.' });
    }

}


module.exports = verifyToken;