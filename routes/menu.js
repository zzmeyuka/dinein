const express = require('express');
const Menu = require('../models/menu');
const userAuth = require('./user');
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

// Get all menu items (public)
router.get('/', async (req, res) => {
    try {
        const menus = await Menu.find();
        res.json(menus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search menu items by name or category
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const menus = await Menu.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(menus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get menu items by category
router.get('/category/:category', async (req, res) => {
    try {
        const menus = await Menu.find({ 
            category: { $regex: new RegExp(req.params.category, 'i') }
        });
        res.json(menus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new menu item (admin only)
router.post('/', userAuth.verifyToken, isAdmin, async (req, res) => {
    try {
        const menu = new Menu(req.body);
        const savedMenu = await menu.save();
        res.status(201).json(savedMenu);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a menu item (admin only)
router.put('/:id', userAuth.verifyToken, isAdmin, async (req, res) => {
    try {
        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!menu) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(menu);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a menu item (admin only)
router.delete('/:id', userAuth.verifyToken, isAdmin, async (req, res) => {
    try {
        const menu = await Menu.findByIdAndDelete(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
