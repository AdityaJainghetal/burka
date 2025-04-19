const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    barcode: {
        type: String,
    },
    price: {
        type: String
    },
    description: {
        type: String,
    },
    color: {
        type: String
    },
    fabric: {
        type: String
    },
    size: [
        {
            type: String
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    subCategory: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory"
    },
    images: [
        {
            type: String
        }
    ]
}, {
    timestamps: true,
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;
