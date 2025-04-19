const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Add a product to the cart or increase quantity if it exists
const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const product = await Product.findById(productId);

        let cart = await Cart.findOne();
        if (!cart) {
            cart = new Cart({ products: [{ product: productId, quantity: 1 }] });
        } else {
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity = String(Number(cart.products[productIndex].quantity) + 1);
            } else {
                cart.products.push({ product: productId, quantity: "1" });
            }
        }

        await cart.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update product quantity in cart, delete if quantity is 0
const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        if (!productId || quantity === undefined) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        let cart = await Cart.findOne().populate('products.product') // Populating the product 
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
     
        

        const productIndex = cart.products.findIndex(p => p.product._id.toString() == productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (Number(quantity) === 0) {
            cart.products.splice(productIndex, 1); // Remove product from cart
        } else {
            cart.products[productIndex].quantity = String(quantity);
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove a product from the cart
const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        let cart = await Cart.findOne();
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the cart details
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne().populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToCart, updateCartItem, removeCartItem, getCart };