const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');

// Read current products
const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Fix stock for all products
data.products = data.products.map(product => {
  // Convert old stock format to new format if needed
  let stockQuantity = 0;
  
  if (typeof product.stock === 'number') {
    stockQuantity = product.stock;
  } else if (product.stock?.quantity) {
    stockQuantity = product.stock.quantity;
  } else {
    stockQuantity = Math.floor(Math.random() * 100) + 10; // Random between 10-110
  }
  
  return {
    ...product,
    stock: {
      inStock: true,
      quantity: stockQuantity
    }
  };
});

// Write back
fs.writeFileSync(productsPath, JSON.stringify(data, null, 2));
console.log(`✅ Fixed stock for ${data.products.length} products`);
