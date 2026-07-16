const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, default: 1 },
  color:     { type: String, default: '' },
  image:     { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  items:    [orderItemSchema],
  contact:  { type: String, required: true },
  shippingAddress: {
    country:  { type: String, default: 'Pakistan' },
    firstName:{ type: String, required: true },
    lastName: { type: String, default: '' },
    address:  { type: String, required: true },
    apartment:{ type: String, default: '' },
    city:     { type: String, required: true },
    postal:   { type: String, default: '' },
    phone:    { type: String, required: true }
  },
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'free'],
    default: 'standard'
  },
  shippingCost: { type: Number, default: 0 },
  paymentMethod: {
    type: String,
    enum: ['cod', 'jazzcash', 'bank'],
    default: 'cod'
  },
  subtotal: { type: Number, required: true },
  total:    { type: Number, required: true },
  currency: { type: String, default: 'PKR' },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

orderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);
