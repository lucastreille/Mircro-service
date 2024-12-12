const express = require('express');
const client = require('prom-client');
const axios = require('axios');
const mongoose = require('mongoose');
const Order = require('./models/order');
const app = express();
const verifyToken = require('./middleware'); 
const PORT = 3003;

const register = new client.Registry();

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total des requêtes HTTP',
  labelNames: ['method', 'path', 'status']
});

register.registerMetric(httpRequestCounter);

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

app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});

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
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(403).json({ error: 'Token manquant dans les en-têtes.' });
      }
  
      const response = await axios.get('http://mircro-service-user-service-1:3001/user', {
        headers: {
          Authorization: token, 
        },
      });
      const user = response.data.user;
      
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé dans m1.' });
      }
  
      let totalPrice = 0;
      const productDetails = [];
  
      for (const item of products) {
        const { productId, quantity } = item;
  
        if (!productId || !quantity || quantity <= 0) {
          return res.status(400).json({ error: `Produit invalide : ${JSON.stringify(item)}` });
        }
  
        const productResponse = await axios.get(`http://mircro-service-product-service-1:3002/products/${productId}`);
        const product = productResponse.data;
  
        if (!product) {
          return res.status(404).json({ error: `Produit non trouvé : ${productId}` });
        }
  
        const price = product.finalPrice; // Prix unitaire
        productDetails.push({ productId, quantity, price });
        totalPrice += price * quantity;
      }
  
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
        const { discountCode, ...updateData } = req.body; 

        let discountValue = 0;

        const currentOrder = await Order.findById(req.params.id);
        if (!currentOrder) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        if (currentOrder.discountCode) {
          return res.status(400).json({ error: 'Un code de réduction a déjà été appliqué à cette commande' });
      }

        let finalPrice = currentOrder.totalPrice; 

        if (discountCode) {
            const discount = await Discount.findOne({ code: discountCode });

            if (!discount) {
                return res.status(400).json({ error: 'Code de réduction invalide' });
            }
            
            if (new Date() > discount.expiryDate) {
                return res.status(400).json({ error: 'Code de réduction expiré' });
            }

            discountValue = discount.value; 
            finalPrice = finalPrice - (finalPrice * discountValue) / 100; 
        }

        updateData.discountCode = discountCode || currentOrder.discountCode;
        updateData.discountValue = discountValue; 
        updateData.totalPrice = finalPrice; 
        

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

app.put('/orders/modifqtt/:id', verifyToken, async (req, res) => {
  try {
    const { products } = req.body; 
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Doit contenir au moins un produit à modifier.' });
    }

    const currentOrder = await Order.findById(req.params.id);
    if (!currentOrder) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    let totalPrice = 0; 

    for (const { productId, quantity } of products) {
      if (!productId || quantity <= 0) {
        return res.status(400).json({ error: `Quantité ou ID de produit invalide pour le produit ${productId}` });
      }

      const productToUpdate = currentOrder.products.find(p => p.productId.toString() === productId);
      if (!productToUpdate) {
        return res.status(404).json({ error: `Produit avec ID ${productId} non trouvé dans la commande` });
      }

      productToUpdate.quantity = quantity;

      const productResponse = await axios.get(`http://mircro-service-product-service-1:3002/products/${productId}`);
      const product = productResponse.data;
      if (!product) {
        return res.status(404).json({ error: `Produit avec ID ${productId} non trouvé dans le service produit` });
      }

      const newPrice = product.finalPrice * quantity;
      productToUpdate.price = newPrice; 
    }

    totalPrice = currentOrder.products.reduce((acc, product) => acc + product.price, 0);

    currentOrder.totalPrice = totalPrice;

    await currentOrder.save();

    res.json(currentOrder); 
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande :', error.message);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la commande', details: error.message });
  }
});



  app.delete('/orders/:id',verifyToken, async (req, res) => {
    try {
      const deletedOrder = await Order.findByIdAndDelete(req.params.id);
      if (!deletedOrder) return res.status(404).json({ error: 'Commande non trouvée' });
      if (deletedOrder.status === 'validated') {
        return res.status(403).json({ error: 'Impossible de supprimer une commande validée' });
      }
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