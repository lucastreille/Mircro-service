const express = require('express');
const client = require('prom-client');
const app = express();
const PORT = 3001;

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
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
});

// Exposer les métriques sur /metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`User Service running on http://localhost:${PORT}`);
});
