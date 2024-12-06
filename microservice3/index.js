const express = require('express');
const client = require('prom-client');
const axios = require('axios');
const mongoose = require('mongoose');
const Order = require('./models/order');
const app = express();
const PORT = 3003;

// Créer un registre pour Prometheus
const register = new client.Registry();

// Créer un compteur de requêtes HTTP
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total des requêtes HTTP',
  labelNames: ['method', 'path', 'status']
});

// Ajouter le compteur au registre
register.registerMetric(httpRequestCounter);

// Middleware pour collecter les métriques sur chaque requête
app.use(express.json());
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

// Route principale
// app.get('/orders', (req, res) => {
//   res.json([
//     { id: 1, userId: 1, productId: 1 },
//     { id: 2, userId: 2, productId: 2 }
//   ]);
// });

// Route pour récupérer les détails des commandes (en appelant les autres services)
// app.get('/orders-with-details', async (req, res) => {
//   try {
//     const users = await axios.get('http://user-service:3001/users');
//     const products = await axios.get('http://product-service:3002/products');

//     const orders = [
//       { id: 1, user: users.data[0], product: products.data[0] },
//       { id: 2, user: users.data[1], product: products.data[1] }
//     ];

//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur lors de la récupération des données' });
//   }
// });

// Exposer les métriques sur /metrics
// app.get('/metrics', async (req, res) => {
//   res.set('Content-Type', register.contentType);
//   res.end(await register.metrics());
// });

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});

// Connexion à MongoDB Atlas
const mongoURI = 'mongodb+srv://dali19:Z.d18082023@cluster0.aom28.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));


 
  
  app.post('/orders', async (req, res) => {
    try {
      const { userId, productId, quantity, discountCode } = req.body;
  
      if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: 'Données manquantes ou incorrectes' });
      }
  
      let discountValue = 0;
  
      // Vérifie si un code de réduction est fourni
      if (discountCode) {
        const discount = await Discount.findOne({ code: discountCode });
  
        if (!discount) {
          return res.status(400).json({ error: 'Code de réduction invalide' });
        }
  
        // Vérifie si le code est expiré
        if (new Date() > discount.expiryDate) {
          return res.status(400).json({ error: 'Code de réduction expiré' });
        }
  
        discountValue = discount.value; // Applique la réduction
      }
  
      // Crée la commande avec la réduction (si applicable)
      const newOrder = new Order({ userId, productId, quantity, discountCode, discountValue });
      await newOrder.save();
  
      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Erreur lors de la création de la commande :', error.message);
      res.status(500).json({ error: 'Erreur lors de la création de la commande', details: error.message });
    }
  });
  
  
  

  app.get('/orders', async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
  });


  app.put('/orders/:id', async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedOrder) return res.status(404).json({ error: 'Commande non trouvée' });
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la commande' });
    }
  });

  app.delete('/orders/:id', async (req, res) => {
    try {
      const deletedOrder = await Order.findByIdAndDelete(req.params.id);
      if (!deletedOrder) return res.status(404).json({ error: 'Commande non trouvée' });
      res.json({ message: 'Commande supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de la commande' });
    }
  });
  
const Discount = require('./models/discount');
app.post('/discounts', async (req, res) => {
  try {
    const { code, value, expiryDate } = req.body;

    if (!code || !value || !expiryDate) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    const newDiscount = new Discount({ code, value, expiryDate });
    await newDiscount.save();

    res.status(201).json(newDiscount);
  } catch (error) {
    console.error('Erreur lors de la création du code de réduction :', error);
    res.status(500).json({ error: 'Erreur lors de la création du code de réduction' });
  }
});
