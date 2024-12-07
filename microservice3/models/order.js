const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  status: { type: String, default: 'pending' },
  discountCode: { type: String, default: null }, // Nouveau champ pour le code de réduction
  discountValue: { type: Number, default: 0 }, // Valeur de la réduction appliquée
  totalPrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
