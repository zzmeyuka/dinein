const express = require('express');
const Order = require('../models/order');
const userAuth = require('./user');
const verifyToken = userAuth.verifyToken;
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

// Get all orders (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'email')
            .populate('items', 'name price');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user's orders
router.get('/my-orders', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId })
            .populate('items', 'name price');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new order
router.post('/', verifyToken, async (req, res) => {
    try {
        const order = new Order({
            userId: req.user.userId,
            items: req.body.items,
            status: 'new'
        });

        const savedOrder = await order.save();
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('items', 'name price');
            
        res.status(201).json(populatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update order status (admin only)
router.patch('/:id/status', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['new', 'in process', 'ready'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('items', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
