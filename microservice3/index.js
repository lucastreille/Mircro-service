const express = require('express');
const client = require('prom-client');
const axios = require('axios');
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
app.get('/orders', (req, res) => {
  res.json([
    { id: 1, userId: 1, productId: 1 },
    { id: 2, userId: 2, productId: 2 }
  ]);
});

// Route pour récupérer les détails des commandes (en appelant les autres services)
app.get('/orders-with-details', async (req, res) => {
  try {
    const users = await axios.get('http://user-service:3001/users');
    const products = await axios.get('http://product-service:3002/products');

    const orders = [
      { id: 1, user: users.data[0], product: products.data[0] },
      { id: 2, user: users.data[1], product: products.data[1] }
    ];

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});

// Exposer les métriques sur /metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});
