const mongoose = require('mongoose');

const colorVariantSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  hex: { type: String, trim: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  category:  { type: String, required: true, trim: true },
  price:     { type: Number, required: true },
  oldPrice:  { type: Number, default: 0 },
  currency:  { type: String, default: 'PKR' },
  badge:     { type: String, default: '' },
  inStock:   { type: Boolean, default: true },
  images:    [{ type: String }],
  img:       { type: String },
  colors:    [colorVariantSchema],
  details:   { type: String, default: '' },
  care:      { type: String, default: '' },
  size:      { type: String, default: '' },
  shipping:  { type: String, default: '' }
}, {
  timestamps: true
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
