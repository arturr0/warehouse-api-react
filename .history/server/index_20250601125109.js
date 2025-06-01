const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data/products.json');

// Initialize data file
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE));
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Helper function to read/write data
const getProducts = () => JSON.parse(fs.readFileSync(DATA_FILE));
const saveProducts = (products) => fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));

// API Endpoints
app.get('/api/products', (req, res) => {
  res.json(getProducts());
});

app.post('/api/products', (req, res) => {
  const products = getProducts();
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    quantity: parseInt(req.body.quantity)
  };
  products.push(newProduct);
  saveProducts(products);
  res.json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const products = getProducts();
  const updated = products.map(p => 
    p.id === parseInt(req.params.id) 
      ? { ...p, name: req.body.name, quantity: parseInt(req.body.quantity) }
      : p
  );
  saveProducts(updated);
  res.json({ success: true });
});

app.post('/api/products/quantity/:id', (req, res) => {
  const products = getProducts();
  const updated = products.map(p => 
    p.id === parseInt(req.params.id) 
      ? { ...p, quantity: p.quantity + 1 }
      : p
  );
  saveProducts(updated);
  res.json({ success: true });
});

app.post('/api/products/down/:id', (req, res) => {
  const products = getProducts();
  const updated = products.map(p => 
    p.id === parseInt(req.params.id) 
      ? { ...p, quantity: Math.max(0, p.quantity - 1) }
      : p
  );
  saveProducts(updated);
  res.json({ success: true });
});

app.delete('/api/products/:id', (req, res) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== parseInt(req.params.id));
  saveProducts(filtered);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));