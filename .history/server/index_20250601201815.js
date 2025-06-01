require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const a = process.env.ATLAS;
console.log(a);
// Updated MongoDB connection section
mongoose.connect(process.env.ATLAS || 'mongodb://localhost:27017/warehouse')
  .then(() => {
    console.log('Connected to MongoDB');
    seedInitialData().then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Access at: http://localhost:${PORT}`);
      });
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Updated seed function
async function seedInitialData() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
        { name: 'laptop', quantity: 15 },
        { name: 'microwave', quantity: 7 },
        { name: 'mouse', quantity: 20 }
      ]);
      console.log('Initial data seeded');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, quantity } = req.body;
    if (!name || isNaN(quantity)) {
      return res.status(400).json({ error: 'Invalid product data' });
    }
    
    const newProduct = new Product({
      name: name.trim(),
      quantity: parseInt(quantity)
    });
    
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.route("/api/products/:id")
  .put(async (req, res) => {
    try {
      const { id } = req.params;
      const { name, quantity } = req.body;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { 
          name: name || undefined,
          quantity: quantity ? parseInt(quantity) : undefined
        },
        { new: true }
      );
      
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(updatedProduct);
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Server error' });
    }
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      
      const deletedProduct = await Product.findByIdAndDelete(id);
      
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ success: true });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

app.post('/api/products/:id/quantity', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { quantity: 1 } },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error('Error incrementing quantity:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/products/:id/down', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.quantity <= 0) {
      return res.status(400).json({ error: 'Quantity cannot be negative' });
    }
    
    product.quantity = Math.max(0, product.quantity - 1);
    await product.save();
    
    res.json(product);
  } catch (err) {
    console.error('Error decrementing quantity:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});



