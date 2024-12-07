const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: ['Keyboard', 'Mouse', 'Monitor', 'Other'] },
    stock: { type: Number, required: true, min: 0 },
    reduction: { type: Number, min: 0, max: 100, default: null }, // Réduction en %
    createdAt: { type: Date, default: Date.now }
});

// Calcul du prix final avec la réduction appliquée
productSchema.methods.getFinalPrice = function () {
    if (this.reduction) {
        return this.price * (1 - this.reduction / 100);
    }
    return this.price;
};

module.exports = mongoose.model('Product', productSchema);
