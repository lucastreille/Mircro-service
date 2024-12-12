const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const client = require('prom-client');
const Product = require('./models/Product.js');
const verifyToken = require('./middleware/verifyToken.js'); 
const checkAdmin = require('./middleware/checkAdmin.js'); 
const amqp = require('amqplib');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');


const app = express();
const PORT = 3002;

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

// Route pour Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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


app.use(bodyParser.json());

mongoose.connect('mongodb+srv://mathias:7ZuBXb5YTG6hQ9s2@microservice-product.npvcz.mongodb.net/?retryWrites=true&w=majority&appName=Microservice-product', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));


// Fonction pour envoyer un message RabbitMQ
async function sendMessageToUserService(message) {
    const connection = await amqp.connect('amqp://rabbitmq'); 
    const channel = await connection.createChannel();
    const queue = 'product_created';
  
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(message)); 
  
    console.log(`Message envoyé à user-service: ${message}`);
    setTimeout(() => connection.close(), 500);
}


app.post('/products', verifyToken, checkAdmin, async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();

        // Envoyer un message à user-service pour informer de la création du produit
        const message = `Un nouveau produit a été créé: ${savedProduct.name}`;
        sendMessageToUserService(message);

        res.status(201).json({
            ...savedProduct.toObject(),
            finalPrice: savedProduct.getFinalPrice() 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        const result = products.map(product => ({
            ...product.toObject(),
            finalPrice: product.getFinalPrice() 
        }));
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({
            ...product.toObject(),
            finalPrice: product.getFinalPrice()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.put('/products/:id', verifyToken, checkAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({
            ...updatedProduct.toObject(),
            finalPrice: updatedProduct.getFinalPrice()
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.delete('/products/:id', verifyToken, checkAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


