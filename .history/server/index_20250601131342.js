const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data/products.json');

// Create data file if not exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([
    { id: 1, name: 'laptop', quantity: 15 },
    { id: 2, name: 'microwave', quantity: 7 },
    { id: 3, name: 'mouse', quantity: 20 }
  ]));
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../client/build')));

// API Endpoints
const getProducts = () => JSON.parse(fs.readFileSync(DATA_FILE));
const saveProducts = (products) => fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));