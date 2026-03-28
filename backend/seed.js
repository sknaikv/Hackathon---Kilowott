const storage = require('./services/fileStorage');

const sampleProducts = [
  {
    name: "Nike Air Max 270 - White",
    description: "Experience unparalleled comfort with Nike's Air Max 270 featuring the brand's biggest heel Air unit yet. This sleek white colorway combines mesh and synthetic materials for breathability and durability. Perfect for all-day wear, whether you're hitting the gym or the streets.",
    price: 150.00,
    sku: "NIKE-AM270-WHT-10",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"],
    category: "Shoes",
    attributes: {
      brand: "Nike",
      color: "White",
      size: "10",
      gender: "Unisex",
      material: "Mesh and Synthetic"
    },
    stock: { quantity: 50, inStock: true },
    aiGenerated: { description: true, attributes: false }
  },
  {
    name: "Samsung Galaxy Buds Pro - Black",
    description: "Immersive sound quality with intelligent Active Noise Cancellation. These premium wireless earbuds are engineered for all-day comfort with a secure, ergonomic fit. Featuring 360 Audio, water resistance, and wireless charging for the ultimate listening experience.",
    price: 199.99,
    sku: "SAMSUNG-GBP-BLK",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400"],
    category: "Electronics",
    attributes: {
      brand: "Samsung",
      color: "Black",
      connectivity: "Bluetooth 5.0",
      battery: "8 hours",
      features: ["ANC", "Water Resistant", "Wireless Charging"]
    },
    stock: { quantity: 25, inStock: true }
  },
  {
    name: "Apple MacBook Pro 14-inch M3 Pro 18GB 512GB",
    description: "Supercharged for pros with the M3 Pro chip. The 14-inch MacBook Pro blasts through workflows with a powerful next-generation CPU and GPU. Featuring a Liquid Retina XDR display, legendary battery life, and an array of pro ports for maximum productivity.",
    price: 1999.00,
    sku: "APPLE-MBP14-M3-512",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"],
    category: "Computers",
    attributes: {
      brand: "Apple",
      processor: "M3 Pro",
      ram: "18GB",
      storage: "512GB SSD",
      screen: "14-inch Liquid Retina XDR",
      color: "Space Gray"
    },
    stock: { quantity: 10, inStock: true }
  },
  {
    name: "Levi's 501 Original Fit Jeans - Blue Denim",
    description: "The iconic straight fit jean that started it all. Since 1873, the Levi's 501 Original has been a blank canvas for self-expression. This authentic blue denim wash features the classic button fly, five-pocket styling, and sits at the waist with a regular fit through the hip and thigh.",
    price: 89.99,
    sku: "LEVIS-501-BLUE-32X32",
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"],
    category: "Clothing",
    attributes: {
      brand: "Levi's",
      style: "501 Original Fit",
      color: "Blue Denim",
      size: "32x32",
      material: "100% Cotton",
      fit: "Straight"
    },
    stock: { quantity: 75, inStock: true }
  },
  {
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description: "Industry-leading noise cancellation with two processors controlling eight microphones for unprecedented quiet. The WH-1000XM5 offers exceptional sound quality, crystal-clear hands-free calling, and up to 30 hours of battery life. Lightweight design with soft leather padding for all-day comfort.",
    price: 399.99,
    sku: "SONY-WH1000XM5-BLK",
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400"],
    category: "Electronics",
    attributes: {
      brand: "Sony",
      color: "Black",
      type: "Over-Ear",
      connectivity: "Bluetooth 5.2",
      battery: "30 hours",
      features: ["ANC", "Multipoint Connection", "Speak-to-Chat"]
    },
    stock: { quantity: 30, inStock: true }
  },
  {
    name: "Adidas Ultraboost 22 Running Shoes - Core Black",
    description: "Push your limits with responsive Boost cushioning and a flexible Primeknit+ upper. The Ultraboost 22 delivers incredible energy return with every stride, while the Continental rubber outsole provides superior traction in all conditions. Engineered for runners who demand the best.",
    price: 190.00,
    sku: "ADIDAS-UB22-BLK-10",
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400"],
    category: "Shoes",
    attributes: {
      brand: "Adidas",
      model: "Ultraboost 22",
      color: "Core Black",
      size: "10",
      type: "Running",
      technology: "Boost Cushioning"
    },
    stock: { quantity: 40, inStock: true }
  },
  {
    name: "KitchenAid Artisan Stand Mixer 5-Quart - Empire Red",
    description: "The iconic KitchenAid stand mixer combines form and function for your culinary creations. This 5-quart tilt-head mixer features 10 speeds, a powerful 325-watt motor, and includes a flat beater, dough hook, and wire whip. Built to last with all-metal construction.",
    price: 449.99,
    sku: "KITCHENAID-5QT-RED",
    images: ["https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400"],
    category: "Home & Kitchen",
    attributes: {
      brand: "KitchenAid",
      capacity: "5 Quart",
      color: "Empire Red",
      power: "325 Watts",
      speeds: "10",
      type: "Tilt-Head"
    },
    stock: { quantity: 15, inStock: true }
  },
  {
    name: "Patagonia Better Sweater Fleece Jacket - Navy Blue",
    description: "A versatile midlayer or stand-alone jacket made from warm, comfortable sweater-knit fleece. The Better Sweater features a full-zip front, zippered handwarmer pockets, and a stand-up collar for extra coverage. Fair Trade Certified sewn with durable water repellent finish.",
    price: 139.00,
    sku: "PATAGONIA-BS-NAVY-M",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"],
    category: "Clothing",
    attributes: {
      brand: "Patagonia",
      color: "Navy Blue",
      size: "Medium",
      material: "100% Recycled Polyester",
      fit: "Regular",
      features: ["Full Zip", "Stand-up Collar", "DWR Finish"]
    },
    stock: { quantity: 50, inStock: true }
  },
  {
    name: "Hydro Flask 32oz Wide Mouth Water Bottle - Fog",
    description: "Keep your beverages ice cold for up to 24 hours or piping hot for 12 hours with TempShield double-wall vacuum insulation. The wide mouth opening makes it easy to fill, pour, and clean. Made with BPA-free, food-grade 18/8 stainless steel that won't retain flavors.",
    price: 44.95,
    sku: "HYDRO-32WM-FOG",
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"],
    category: "Sports & Outdoors",
    attributes: {
      brand: "Hydro Flask",
      capacity: "32 oz",
      color: "Fog",
      type: "Wide Mouth",
      material: "Stainless Steel",
      features: ["Insulated", "BPA-Free", "Dishwasher Safe"]
    },
    stock: { quantity: 100, inStock: true }
  },
  {
    name: "Canon EOS R6 Mark II Mirrorless Camera Body",
    description: "Professional hybrid camera with 24.2MP full-frame sensor and advanced autofocus performance. The R6 Mark II delivers exceptional image quality with up to 40fps continuous shooting, 6K video recording, and in-body image stabilization. Perfect for both photography and videography professionals.",
    price: 2499.00,
    sku: "CANON-R6M2-BODY",
    images: ["https://images.unsplash.com/photo-1606980370788-adaf7374eb84?w=400"],
    category: "Electronics",
    attributes: {
      brand: "Canon",
      model: "EOS R6 Mark II",
      sensor: "24.2MP Full-Frame",
      video: "6K RAW",
      features: ["In-Body Stabilization", "Dual Card Slots", "40fps Burst"],
      mount: "RF Mount"
    },
    stock: { quantity: 5, inStock: true }
  }
];

async function seed() {
  console.log('🌱 Starting seed process...\n');
  
  let created = 0;
  let skipped = 0;

  for (const product of sampleProducts) {
    try {
      await storage.createProduct(product);
      console.log(`✅ Created: ${product.name}`);
      created++;
    } catch (error) {
      if (error.message.includes('SKU already exists')) {
        console.log(`⏭️  Skipped: ${product.name} (already exists)`);
        skipped++;
      } else {
        console.log(`❌ Error: ${product.name} - ${error.message}`);
      }
    }
  }

  console.log(`\n✨ Seed complete!`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${sampleProducts.length}\n`);
}

// Run seed
seed()
  .then(() => {
    console.log('🎉 All done! Your PIM system is ready for demo.\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
