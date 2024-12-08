const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // Prix unitaire du produit
    }
  ],
  totalPrice: { type: Number, required: true, default: 0 }, // Calculé automatiquement
  status: { type: String, default: 'pending' },
  discountCode: { type: String, default: null },
  discountValue: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
