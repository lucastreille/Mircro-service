
const { v4: uuidv4 } = require('uuid');  

const express = require('express');
const app = express();
app.use(express.json());


const client = require('prom-client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./bdd.js');
const verifyToken = require('./middleware'); 

const PORT = 3001;
const JWT_SECRET = 'vaV4RRCQLpV4IgFew1R08QQvet0b716wzP0W24DDgI2tObYdQYMY9fbikHzL1Pfz';



const register = new client.Registry();

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total des requêtes HTTP',
  labelNames: ['method', 'path', 'status']
});


register.registerMetric(httpRequestCounter);

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      path: req.path,
      status: res.statusCode
    });
  });
  next();
});





app.post('/register', async (req, res) => {

  const { email, password, name, lastName } = req.body;

  if (!email || !password|| !name || !lastName) {
    return res.status(400).json({ message: 'Veuillez fournir toutes les informations.' });
  }

  try {

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      
      if (err) throw err;

      if (results.length > 0) {
        return res.status(400).json({ message: 'Cet email est déjà enregistré.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      db.query('INSERT INTO users (uuid, email, mot_de_passe, nom, prenom) VALUES (?, ?, ?, ?, ?)', [userId, email, hashedPassword, name, lastName], (err, result) => {
        if (err) throw err;

        const token = jwt.sign({ id: userId, email: email }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).json({ message: 'Utilisateur enregistré avec succès.', token });
      });

    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error });
  }
});




app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }

    const user = results[0];

    if (!user.mot_de_passe) {
      return res.status(500).json({ message: 'Mot de passe manquant dans la base de données.' });
    }

    try {

      const isMatch = await bcrypt.compare(password, user.mot_de_passe);

      if (!isMatch) {
        return res.status(400).json({ message: 'Mot de passe incorrect.' });
      }


      const token = jwt.sign({ id: user.uuid, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      return res.json({
        message: 'Connexion réussie.',
        token,
      });

    } catch (error) {
      console.error('Erreur lors de la comparaison du mot de passe:', error);
      return res.status(500).json({ message: 'Erreur interne', error });
    }

  });

});





app.get('/user', verifyToken, (req, res) => {
  const userId = req.user.id;

  db.query('SELECT uuid, email, nom, prenom FROM users WHERE uuid = ?', [userId], (err, results) => {
    
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const user = results[0];
    res.json({
      message: 'Détails de l\'utilisateur récupérés avec succès.',
      user,
    });

  });

});


app.put('/user/:uuid', verifyToken, (req, res) => {
  
  const userId = req.user.id; 
  const userUuid = req.params.uuid; 

  if (userId !== userUuid) {
    return res.status(403).json({ message: 'Vous ne pouvez pas modifier un autre utilisateur.' });
  }

  const { email, name, lastName } = req.body;

  if (!email || !name || !lastName) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  const updateQuery = 'UPDATE users SET email = ?, nom = ?, prenom = ? WHERE uuid = ?';

  db.query(updateQuery, [email, name, lastName, userUuid], (err, results) => {
    
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour', error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.json({
      message: 'Utilisateur mis à jour avec succès.',
      updatedUser: {
        uuid: userUuid,
        email,
        name,
        lastName,
      }
    });

  });

});



app.delete('/user/:uuid', verifyToken, (req, res) => {
  
  const userId = req.user.id; 
  const userUuid = req.params.uuid; 

  if (userId !== userUuid) {
    return res.status(403).json({ message: 'Vous ne pouvez pas supprimer un autre utilisateur.' });
  }

  const deleteQuery = 'DELETE FROM users WHERE uuid = ?';

  db.query(deleteQuery, [userUuid], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur lors de la suppression', error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès.' });
  });

});





app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});




app.listen(PORT, () => {
  console.log(`User Service running on http://localhost:${PORT}`);
});
