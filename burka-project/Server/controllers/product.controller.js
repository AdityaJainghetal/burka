const Product = require('../models/product.model');
const imagekit = require('../config/imageKit')
const {generateBarcode} = require('../config/bwip-js.config')

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category").populate("subCategory");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new product



const createProduct = async (req, res) => {
    try {
      const {
        name,
        price,
        mrp,
        description,
        color,
        fabric,
        size,
        category,
        subCategory,
      } = req.body;
  
      // Parse JSON string if needed (e.g., size might be sent as stringified array)
      const parsedSize = JSON.parse(size);
  
      const uploadedImages = [];
  
      const files = Array.isArray(req.files?.images)
        ? req.files.images
        : [req.files?.images]; // handles both single and multiple images
  
      for (let file of files) {
        const buffer = file.data; // file.data is a Buffer
        const uploadResponse = await imagekit.upload({
          file: buffer,
          fileName: file.name,
        });
  
        uploadedImages.push(uploadResponse.url);
      }
  
      const newProduct = new Product({
        name,
        price,
        description,
        color,
        fabric,
        size: parsedSize,
        category,
        subCategory,
        images: uploadedImages, // URLs from ImageKit
      });
  
      await newProduct.save();
  
      // Generate Barcode
      const barcodeImage = await generateBarcode(newProduct._id.toString());
  
      // Update product with barcode
      newProduct.barcode = barcodeImage;
      await newProduct.save();
  
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: error.message });
    }
  };





  

// Update a product
const updateProduct = async (req, res) => {
    try {
        const { name, image, price } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, image, price },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const products = await Product.find();
        res.status(200).json({ message: 'Product deleted successfully', data: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };