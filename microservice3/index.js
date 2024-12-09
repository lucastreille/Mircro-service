const express = require('express');
const client = require('prom-client');
const axios = require('axios');
const mongoose = require('mongoose');
const Order = require('./models/order');
const app = express();
const verifyToken = require('./middleware'); 
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


// Exposer les métriques sur /metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});






// Connexion à MongoDB Atlas
const mongoURI = 'mongodb+srv://dali19:Z.d18082023@cluster0.aom28.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));


  app.get('/orders', verifyToken, async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
  });
  

  app.post('/orders', verifyToken, async (req, res) => {
    const { products } = req.body;
    console.log('Utilisateur connecté :', req.user);
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'La commande doit contenir au moins un produit.' });
    }
  
    try {
      // Récupérer le token JWT de la requête
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(403).json({ error: 'Token manquant dans les en-têtes.' });
      }
  
      // Appeler le microservice des utilisateurs pour récupérer l'utilisateur
      const response = await axios.get('http://mircro-service-user-service-1:3001/user', {
        headers: {
          Authorization: token, // Transmettre le token dans les en-têtes
        },
      });
      const user = response.data.user;
      
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé dans m1.' });
      }
  
      let totalPrice = 0;
      const productDetails = [];
  
      // Récupérer les détails de chaque produit et calculer le prix total
      for (const item of products) {
        const { productId, quantity } = item;
  
        // Valider les données de chaque produit
        if (!productId || !quantity || quantity <= 0) {
          return res.status(400).json({ error: `Produit invalide : ${JSON.stringify(item)}` });
        }
  
        // Appeler le microservice des produits pour récupérer les informations
        const productResponse = await axios.get(`http://mircro-service-product-service-1:3002/products/${productId}`);
        const product = productResponse.data;
  
        if (!product) {
          return res.status(404).json({ error: `Produit non trouvé : ${productId}` });
        }
  
        // Ajouter les détails du produit et calculer le total
        const price = product.finalPrice; // Prix unitaire
        productDetails.push({ productId, quantity, price });
        totalPrice += price * quantity;
      }
  
      // Créer la commande
      const newOrder = new Order({
        userId: req.user.id,
        products: productDetails,
        totalPrice,
      });
  
      await newOrder.save();
  
      res.status(201).json({
        message: 'Commande créée avec succès.',
        order: newOrder,
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande :', error.message);
      res.status(500).json({ error: 'Erreur lors de la création de la commande', details: error.message });
    }
  });
  
  
  app.put('/orders/:id', verifyToken, async (req, res) => {
    try {
        const { discountCode, ...updateData } = req.body; // Sépare discountCode des autres champs

        let discountValue = 0;

        // Récupérer la commande actuelle
        const currentOrder = await Order.findById(req.params.id);
        if (!currentOrder) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        let finalPrice = currentOrder.totalPrice; // Prix actuel avant modification

        // Si un code de réduction est fourni
        if (discountCode) {
            const discount = await Discount.findOne({ code: discountCode });

            if (!discount) {
                return res.status(400).json({ error: 'Code de réduction invalide' });
            }

            // Vérifie si le code est expiré
            if (new Date() > discount.expiryDate) {
                return res.status(400).json({ error: 'Code de réduction expiré' });
            }

            // Calculer la valeur de la réduction (en pourcentage)
            discountValue = discount.value; // Par exemple, 10 pour 10%
            finalPrice = finalPrice - (finalPrice * discountValue) / 100; // Appliquer la réduction
        }

        // Ajouter les champs liés à la réduction dans les données mises à jour
        updateData.discountCode = discountCode || currentOrder.discountCode; // Conserver le code précédent s'il n'est pas modifié
        updateData.discountValue = discountValue; // La valeur de la réduction
        updateData.totalPrice = finalPrice; // Mettre à jour le prix final
        

        // Mettre à jour la commande
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        
        res.json(updatedOrder);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande :', error.message);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la commande', details: error.message });
    }
});


  app.delete('/orders/:id',verifyToken, async (req, res) => {
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





app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});



// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});
