const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Product = require('./models/Product.js');
const verifyToken = require('./middleware/verifyToken.js'); // Middleware pour vérifier le token JWT
const checkAdmin = require('./middleware/checkAdmin.js');   // Middleware pour vérifier le rôle admin

const app = express();
const PORT = 3002;

// Middleware
app.use(bodyParser.json());

// Connexion à MongoDB (Remplace <cluster-uri> par ton URI MongoDB)
mongoose.connect('mongodb+srv://mathias:7ZuBXb5YTG6hQ9s2@microservice-product.npvcz.mongodb.net/?retryWrites=true&w=majority&appName=Microservice-product', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes CRUD
// CREATE
app.post('/products', verifyToken, checkAdmin, async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();

        res.status(201).json({
            ...savedProduct.toObject(),
            finalPrice: savedProduct.getFinalPrice() // Prix final calculé
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// READ ALL
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        const result = products.map(product => ({
            ...product.toObject(),
            finalPrice: product.getFinalPrice() // Prix final calculé
        }));
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ ONE
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({
            ...product.toObject(),
            finalPrice: product.getFinalPrice() // Prix final calculé
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// UPDATE
app.put('/products/:id', verifyToken, checkAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({
            ...updatedProduct.toObject(),
            finalPrice: updatedProduct.getFinalPrice() // Prix final calculé
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// DELETE
app.delete('/products/:id', verifyToken, checkAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lancement du serveur
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
