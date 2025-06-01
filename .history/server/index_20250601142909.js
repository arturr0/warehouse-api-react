const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data/products.json');

// Create data file if not exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE));
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([
    { id: 1, name: 'laptop', quantity: 15 },
    { id: 2, name: 'microwave', quantity: 7 },
    { id: 3, name: 'mouse', quantity: 20 }
  ]));
}

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build'))); // Fixed path

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Helper functions
const getProducts = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (err) {
    console.error('Error reading products file:', err);
    return [];
  }
};

const saveProducts = (products) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('Error saving products:', err);
  }
};

// API Routes
app.get('/api/products', (req, res) => {
  res.json(getProducts());
});

app.post('/api/products', (req, res) => {
  const products = getProducts();
  const newProduct = {
    id: Date.now(),
    name: req.body.name || 'New Product',
    quantity: parseInt(req.body.quantity) || 0
  };
  products.push(newProduct);
  saveProducts(products);
  res.json(newProduct);
});

// Unified ID routes - FIXED QUOTES
app.route("/api/products/:id")
  .put((req, res) => {
    const id = parseInt(req.params.id);
    const products = getProducts();
    const updated = products.map(p => 
      p.id === id 
        ? { 
            ...p, 
            name: req.body.name || p.name, 
            quantity: parseInt(req.body.quantity) || p.quantity 
          }
        : p
    );
    saveProducts(updated);
    res.json({ success: true });
  })
  .delete((req, res) => {
    const id = parseInt(req.params.id);
    const products = getProducts();
    const filtered = products.filter(p => p.id !== id);
    saveProducts(filtered);
    res.json({ success: true });
  });

// Quantity routes
app.post('/api/products/:id/quantity', (req, res) => {
  const id = parseInt(req.params.id);
  const products = getProducts();
  const updated = products.map(p => 
    p.id === id 
      ? { ...p, quantity: p.quantity + 1 }
      : p
  );
  saveProducts(updated);
  res.json({ success: true });
});

app.post('/api/products/:id/down', (req, res) => {
  const id = parseInt(req.params.id);
  const products = getProducts();
  const updated = products.map(p => 
    p.id === id 
      ? { ...p, quantity: Math.max(0, p.quantity - 1) }
      : p
  );
  saveProducts(updated);
  res.json({ success: true });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});