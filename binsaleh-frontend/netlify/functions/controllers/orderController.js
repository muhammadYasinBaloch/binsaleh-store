const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const body = req.body;
    if (!body.items || !body.items.length) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }
    const order = await Order.create({
      user: req.user ? req.user.id : null,
      items: body.items,
      contact: body.contact,
      shippingAddress: body.shippingAddress,
      shippingMethod: body.shippingMethod,
      shippingCost: body.shippingCost,
      paymentMethod: body.paymentMethod,
      subtotal: body.subtotal,
      total: body.total,
      currency: body.currency || 'PKR'
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
