const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Code unique
  value: { type: Number, required: true }, // Valeur de la réduction en pourcentage
  expiryDate: { type: Date, required: true }, // Date d'expiration
});

module.exports = mongoose.model('Discount', discountSchema);
