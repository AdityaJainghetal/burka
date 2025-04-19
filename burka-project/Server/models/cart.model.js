

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        quantity: {
            type: String
        }
    }]
}, {
    timestamps: true,
});

const cart = mongoose.model('Cart', cartSchema);

module.exports = cart;
