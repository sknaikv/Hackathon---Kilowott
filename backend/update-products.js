const fs = require('fs');
const path = require('path');

const products = [
  {
    "id": "1",
    "name": "Nike Air Max 270 - White",
    "description": "Experience unparalleled comfort with Nike's Air Max 270 featuring the brand's biggest heel Air unit yet. This sleek white colorway combines mesh and synthetic materials for breathability and durability. Perfect for all-day wear.",
    "price": 150.00,
    "sku": "NIKE-AM270-WHT",
    "images": [],
    "category": "Shoes",
    "attributes": {
      "brand": "Nike",
      "color": "White",
      "gender": "Unisex",
      "material": "Mesh & Synthetic",
      "type": "Sneaker"
    },
    "stock": {
      "quantity": 50,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "2",
    "name": "Adidas Ultraboost 22 Running Shoes - Core Black",
    "description": "Energize your run with responsive cushioning from Boost technology. These lightweight running shoes provide exceptional comfort and performance for both casual runners and athletes.",
    "price": 180.00,
    "sku": "ADIDAS-UB22-BLK",
    "images": [],
    "category": "Shoes",
    "attributes": {
      "brand": "Adidas",
      "color": "Black",
      "gender": "Men",
      "material": "Knit Upper",
      "type": "Running Shoe"
    },
    "stock": {
      "quantity": 40,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "3",
    "name": "Puma RS-X Sneakers - Peacoat",
    "description": "Bold retro style meets modern comfort in these statement sneakers. Perfect for casual everyday wear with a premium feel and classic silhouette.",
    "price": 120.00,
    "sku": "PUMA-RSX-PEACOAT",
    "images": [],
    "category": "Shoes",
    "attributes": {
      "brand": "Puma",
      "color": "Peacoat",
      "gender": "Unisex",
      "material": "Suede & Mesh",
      "type": "Casual Sneaker"
    },
    "stock": {
      "quantity": 45,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "4",
    "name": "Converse Chuck Taylor All Star High Top - Red",
    "description": "A timeless classic that never goes out of style. The iconic Chuck Taylor is perfect for any casual outfit and works with virtually any wardrobe.",
    "price": 65.00,
    "sku": "CONVERSE-CTA-RED",
    "images": [],
    "category": "Shoes",
    "attributes": {
      "brand": "Converse",
      "color": "Red",
      "gender": "Unisex",
      "material": "Canvas",
      "type": "High Top"
    },
    "stock": {
      "quantity": 60,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "5",
    "name": "New Balance 990v6 - Grey",
    "description": "The perfect blend of comfort and style. These legendary sneakers feature premium materials and superior cushioning for all-day comfort.",
    "price": 210.00,
    "sku": "NB-990V6-GREY",
    "images": [],
    "category": "Shoes",
    "attributes": {
      "brand": "New Balance",
      "color": "Grey",
      "gender": "Men",
      "material": "Suede & Mesh",
      "type": "Lifestyle Shoe"
    },
    "stock": {
      "quantity": 35,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "6",
    "name": "Vans Old Skool - Black & White",
    "description": "The iconic skate shoe that defined street culture. Perfect for skateboarding or everyday casual wear with its timeless design.",
    "price": 75.00,
    "sku": "VANS-OS-BW",
    "images": [],
    "category": "Shoes",
    "attributes": {
      "brand": "Vans",
      "color": "Black & White",
      "gender": "Unisex",
      "material": "Canvas",
      "type": "Skate Shoe"
    },
    "stock": {
      "quantity": 55,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "7",
    "name": "Brooks Ghost 15 Running Shoe - Navy",
    "description": "Designed for everyday running with DNA Loft v2 foam for a soft, responsive ride. Ideal for neutral runners seeking comfort and reliability.",
    "price": 145.00,
    "sku": "BROOKS-GHOST15-NAVY",
    "images": [],
    "category": "Shoes",
    "attributes": {
      "brand": "Brooks",
      "color": "Navy",
      "gender": "Unisex",
      "material": "Mesh",
      "type": "Running Shoe"
    },
    "stock": {
      "quantity": 42,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "8",
    "name": "Levi's 501 Original Fit Jeans - Dark Blue",
    "description": "The legendary jean that's been a wardrobe staple since 1873. Perfect fit, timeless style, and exceptional durability in classic dark blue denim.",
    "price": 98.00,
    "sku": "LEVIS-501-DARKBLUE",
    "images": [],
    "category": "Jeans",
    "attributes": {
      "brand": "Levi's",
      "color": "Dark Blue",
      "gender": "Men",
      "material": "100% Cotton Denim",
      "fit": "Original Fit"
    },
    "stock": {
      "quantity": 70,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "9",
    "name": "Levi's 721 High Rise Skinny Jeans - Black",
    "description": "Contemporary silhouette with a high rise cut and skinny leg. These jeans offer a flattering fit and versatile styling options.",
    "price": 110.00,
    "sku": "LEVIS-721-BLACK",
    "images": [],
    "category": "Jeans",
    "attributes": {
      "brand": "Levi's",
      "color": "Black",
      "gender": "Women",
      "material": "98% Cotton, 2% Elastane",
      "fit": "High Rise Skinny"
    },
    "stock": {
      "quantity": 52,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "10",
    "name": "Dockers Alpha Khaki - Olive",
    "description": "Smart casual trousers combining comfort with style. Perfect for business casual environments with a modern tapered fit.",
    "price": 85.00,
    "sku": "DOCKERS-ALPHA-OLIVE",
    "images": [],
    "category": "Pants",
    "attributes": {
      "brand": "Dockers",
      "color": "Olive",
      "gender": "Men",
      "material": "98% Cotton, 2% Elastane",
      "fit": "Tapered"
    },
    "stock": {
      "quantity": 48,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "11",
    "name": "Gap Perfect Fit Trousers - Navy",
    "description": "Comfortable and versatile trousers for women that work for both office and casual settings. Made with premium fabric for all-day comfort.",
    "price": 75.00,
    "sku": "GAP-PERFECT-NAVY",
    "images": [],
    "category": "Pants",
    "attributes": {
      "brand": "Gap",
      "color": "Navy",
      "gender": "Women",
      "material": "97% Cotton, 3% Spandex",
      "fit": "Perfect Fit"
    },
    "stock": {
      "quantity": 43,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "12",
    "name": "Tommy Hilfiger T-Shirt - White",
    "description": "Classic crew neck t-shirt in premium cotton. A versatile essential that pairs with anything in your wardrobe.",
    "price": 45.00,
    "sku": "TOMMY-TSHIRT-WHITE",
    "images": [],
    "category": "T-Shirts",
    "attributes": {
      "brand": "Tommy Hilfiger",
      "color": "White",
      "gender": "Men",
      "material": "100% Cotton",
      "size": "S-XXL"
    },
    "stock": {
      "quantity": 85,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "13",
    "name": "Calvin Klein Fitted T-Shirt - Black",
    "description": "Minimalist design meets premium quality. This fitted t-shirt features a contemporary silhouette perfect for modern fashion.",
    "price": 50.00,
    "sku": "CK-FITTED-BLACK",
    "images": [],
    "category": "T-Shirts",
    "attributes": {
      "brand": "Calvin Klein",
      "color": "Black",
      "gender": "Women",
      "material": "100% Cotton",
      "fit": "Fitted"
    },
    "stock": {
      "quantity": 65,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "14",
    "name": "Ralph Lauren Polo Shirt - Navy Blue",
    "description": "The iconic polo shirt in timeless navy. Perfect for smart casual occasions or weekend wear.",
    "price": 98.00,
    "sku": "RALPH-POLO-NAVY",
    "images": [],
    "category": "Polos",
    "attributes": {
      "brand": "Ralph Lauren",
      "color": "Navy Blue",
      "gender": "Men",
      "material": "100% Cotton",
      "style": "Classic Polo"
    },
    "stock": {
      "quantity": 40,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "15",
    "name": "Lacoste Polo Shirt - White",
    "description": "The original Lacoste polo with the iconic crocodile logo. A timeless classic that represents French elegance.",
    "price": 110.00,
    "sku": "LACOSTE-POLO-WHITE",
    "images": [],
    "category": "Polos",
    "attributes": {
      "brand": "Lacoste",
      "color": "White",
      "gender": "Unisex",
      "material": "Piqué Cotton",
      "style": "Regular Fit"
    },
    "stock": {
      "quantity": 38,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "16",
    "name": "The North Face Puffer Jacket - Black",
    "description": "Waterproof insulated jacket perfect for winter weather. Keeps you warm and dry with premium down insulation.",
    "price": 280.00,
    "sku": "TNF-PUFFER-BLACK",
    "images": [],
    "category": "Jackets",
    "attributes": {
      "brand": "The North Face",
      "color": "Black",
      "gender": "Men",
      "material": "Nylon with Down Fill",
      "waterproof": "Yes"
    },
    "stock": {
      "quantity": 25,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "17",
    "name": "Columbia Fleece Jacket - Grey",
    "description": "Lightweight and warm fleece jacket perfect for layering. Ideal for outdoor activities and casual wear.",
    "price": 95.00,
    "sku": "COLUMBIA-FLEECE-GREY",
    "images": [],
    "category": "Jackets",
    "attributes": {
      "brand": "Columbia",
      "color": "Grey",
      "gender": "Women",
      "material": "Polyester Fleece",
      "style": "Full Zip"
    },
    "stock": {
      "quantity": 32,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "18",
    "name": "Patagonia Better Sweater Fleece - Navy",
    "description": "Sustainable fleece made from recycled materials. Perfect for hiking or everyday casual wear.",
    "price": 139.00,
    "sku": "PATAGONIA-FLEECE-NAVY",
    "images": [],
    "category": "Fleece",
    "attributes": {
      "brand": "Patagonia",
      "color": "Navy",
      "gender": "Unisex",
      "material": "Recycled Polyester",
      "eco": "Sustainable"
    },
    "stock": {
      "quantity": 30,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "19",
    "name": "Arc'teryx Shell Jacket - Red",
    "description": "Premium outdoor shell jacket with advanced weather protection. Designed for serious adventurers.",
    "price": 395.00,
    "sku": "ARCTERYX-SHELL-RED",
    "images": [],
    "category": "Jackets",
    "attributes": {
      "brand": "Arc'teryx",
      "color": "Red",
      "gender": "Men",
      "material": "Gore-Tex",
      "waterproof": "Premium"
    },
    "stock": {
      "quantity": 15,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "20",
    "name": "H&M Basic Hoodie - Grey",
    "description": "Comfortable and casual hoodie perfect for everyday wear. Soft fabric and relaxed fit.",
    "price": 35.00,
    "sku": "HM-HOODIE-GREY",
    "images": [],
    "category": "Hoodies",
    "attributes": {
      "brand": "H&M",
      "color": "Grey",
      "gender": "Unisex",
      "material": "Cotton Blend",
      "fit": "Relaxed"
    },
    "stock": {
      "quantity": 90,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "21",
    "name": "Champion Reverse Weave Hoodie - Navy",
    "description": "Classic sportswear hoodie with premium construction. Perfect for workouts or casual lounging.",
    "price": 75.00,
    "sku": "CHAMPION-HOODIE-NAVY",
    "images": [],
    "category": "Hoodies",
    "attributes": {
      "brand": "Champion",
      "color": "Navy",
      "gender": "Unisex",
      "material": "Reverse Weave Cotton",
      "style": "Classic"
    },
    "stock": {
      "quantity": 55,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "22",
    "name": "adidas Essentials Sweatshirt - Black",
    "description": "Versatile and comfortable sweatshirt with the iconic Adidas branding. Great layering piece.",
    "price": 60.00,
    "sku": "ADIDAS-SWEAT-BLACK",
    "images": [],
    "category": "Sweatshirts",
    "attributes": {
      "brand": "Adidas",
      "color": "Black",
      "gender": "Women",
      "material": "Cotton Blend",
      "fit": "Regular"
    },
    "stock": {
      "quantity": 70,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "23",
    "name": "Nike Essential Sweatpants - Black",
    "description": "Comfortable athletic sweatpants for training or casual wear. Features Nike's Dri-FIT technology.",
    "price": 70.00,
    "sku": "NIKE-SWEATPANTS-BLACK",
    "images": [],
    "category": "Activewear",
    "attributes": {
      "brand": "Nike",
      "color": "Black",
      "gender": "Men",
      "material": "Polyester",
      "technology": "Dri-FIT"
    },
    "stock": {
      "quantity": 60,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "24",
    "name": "Under Armour Leggings - Black",
    "description": "Premium athletic leggings with superior stretch and support. Perfect for workouts and active lifestyle.",
    "price": 90.00,
    "sku": "UA-LEGGINGS-BLACK",
    "images": [],
    "category": "Activewear",
    "attributes": {
      "brand": "Under Armour",
      "color": "Black",
      "gender": "Women",
      "material": "81% Polyester, 19% Elastane",
      "high-waist": "Yes"
    },
    "stock": {
      "quantity": 45,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "25",
    "name": "Lululemon ABC Pants - Black",
    "description": "Premium casual pants with exceptional comfort and durability. Modern cut with technical fabric.",
    "price": 128.00,
    "sku": "LULU-ABC-BLACK",
    "images": [],
    "category": "Pants",
    "attributes": {
      "brand": "Lululemon",
      "color": "Black",
      "gender": "Men",
      "material": "Nylon Blend",
      "versatile": "Yes"
    },
    "stock": {
      "quantity": 35,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "26",
    "name": "ASOS Design Denim Jacket - Blue",
    "description": "Classic denim jacket in timeless blue. Perfect for layering and adds edge to any outfit.",
    "price": 65.00,
    "sku": "ASOS-DENIM-BLUE",
    "images": [],
    "category": "Jackets",
    "attributes": {
      "brand": "ASOS Design",
      "color": "Blue",
      "gender": "Women",
      "material": "100% Cotton Denim",
      "fit": "Oversized"
    },
    "stock": {
      "quantity": 50,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "27",
    "name": "Wrangler Western Shirt - Plaid",
    "description": "Classic western-style plaid shirt. Perfect for casual outdoor wear and country aesthetics.",
    "price": 55.00,
    "sku": "WRANGLER-PLAID-SHIRT",
    "images": [],
    "category": "Shirts",
    "attributes": {
      "brand": "Wrangler",
      "color": "Plaid",
      "gender": "Men",
      "material": "100% Cotton",
      "style": "Western"
    },
    "stock": {
      "quantity": 48,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "28",
    "name": "Gap Oxford Button-Down - White",
    "description": "Timeless oxford button-down shirt in crisp white. Essential piece for any wardrobe.",
    "price": 60.00,
    "sku": "GAP-OXFORD-WHITE",
    "images": [],
    "category": "Shirts",
    "attributes": {
      "brand": "Gap",
      "color": "White",
      "gender": "Men",
      "material": "100% Cotton Oxford",
      "fit": "Standard"
    },
    "stock": {
      "quantity": 55,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "29",
    "name": "J.Crew Factory Chinos - Khaki",
    "description": "Classic chinos in versatile khaki. Great for smart casual or dressed-down professional wear.",
    "price": 70.00,
    "sku": "JCREW-CHINO-KHAKI",
    "images": [],
    "category": "Pants",
    "attributes": {
      "brand": "J.Crew Factory",
      "color": "Khaki",
      "gender": "Men",
      "material": "Cotton Blend",
      "fit": "Classic"
    },
    "stock": {
      "quantity": 52,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "30",
    "name": "Banana Republic Tailored Blazer - Navy",
    "description": "Structured tailored blazer perfect for professional settings. Premium fabric and impeccable fit.",
    "price": 198.00,
    "sku": "BR-BLAZER-NAVY",
    "images": [],
    "category": "Blazers",
    "attributes": {
      "brand": "Banana Republic",
      "color": "Navy",
      "gender": "Women",
      "material": "Wool Blend",
      "fit": "Tailored"
    },
    "stock": {
      "quantity": 20,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "31",
    "name": "Timberland Classic Boots - Wheat",
    "description": "Iconic waterproof boots with premium leather. Built for durability and rugged style.",
    "price": 185.00,
    "sku": "TIMBERLAND-BOOTS-WHEAT",
    "images": [],
    "category": "Footwear",
    "attributes": {
      "brand": "Timberland",
      "color": "Wheat",
      "gender": "Men",
      "material": "Full Grain Leather",
      "waterproof": "Yes"
    },
    "stock": {
      "quantity": 28,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "32",
    "name": "Dr. Martens 1460 Boots - Black",
    "description": "Legendary lace-up boots with distinctive yellow stitching. Iconic footwear that lasts for years.",
    "price": 170.00,
    "sku": "DRMARTENS-1460-BLACK",
    "images": [],
    "category": "Footwear",
    "attributes": {
      "brand": "Dr. Martens",
      "color": "Black",
      "gender": "Unisex",
      "material": "Smooth Leather",
      "iconic": "Yes"
    },
    "stock": {
      "quantity": 32,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "33",
    "name": "UGG Classic Short Boots - Chestnut",
    "description": "Cozy and comfortable sheepskin boots perfect for winter. Soft interior and durable exterior.",
    "price": 190.00,
    "sku": "UGG-CLASSIC-CHESTNUT",
    "images": [],
    "category": "Footwear",
    "attributes": {
      "brand": "UGG",
      "color": "Chestnut",
      "gender": "Women",
      "material": "Sheepskin",
      "warmth": "Maximum"
    },
    "stock": {
      "quantity": 35,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "34",
    "name": "Cole Haan Oxfords - Brown",
    "description": "Premium dress shoes with superior comfort. Perfect for business and formal occasions.",
    "price": 210.00,
    "sku": "COLEHAAN-OXFORD-BROWN",
    "images": [],
    "category": "Footwear",
    "attributes": {
      "brand": "Cole Haan",
      "color": "Brown",
      "gender": "Men",
      "material": "Leather",
      "occasion": "Formal"
    },
    "stock": {
      "quantity": 22,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "35",
    "name": "Birkenstock Arizona Sandals - Black",
    "description": "Comfortable and stylish sandals with contoured footbed support. Perfect for casual summer wear.",
    "price": 110.00,
    "sku": "BIRKENSTOCK-ARIZONA-BLACK",
    "images": [],
    "category": "Footwear",
    "attributes": {
      "brand": "Birkenstock",
      "color": "Black",
      "gender": "Unisex",
      "material": "Suede & EVA",
      "support": "Excellent"
    },
    "stock": {
      "quantity": 50,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "36",
    "name": "Steve Madden Heels - Nude",
    "description": "Classic dress heels in neutral nude. Versatile and elegant for any occasion.",
    "price": 110.00,
    "sku": "STEVEMADDEN-HEEL-NUDE",
    "images": [],
    "category": "Footwear",
    "attributes": {
      "brand": "Steve Madden",
      "color": "Nude",
      "gender": "Women",
      "material": "Suede",
      "heel": "3 inch"
    },
    "stock": {
      "quantity": 30,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "37",
    "name": "Sperry Top-Sider Boat Shoes - Brown",
    "description": "Iconic boat shoes with non-marking rubber sole. Perfect for coastal style and nautical vibes.",
    "price": 95.00,
    "sku": "SPERRY-BOAT-BROWN",
    "images": [],
    "category": "Footwear",
    "attributes": {
      "brand": "Sperry",
      "color": "Brown",
      "gender": "Men",
      "material": "Leather",
      "style": "Boat Shoe"
    },
    "stock": {
      "quantity": 40,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "38",
    "name": "Prada Sport Track Jacket - Black",
    "description": "Luxury sportswear with premium construction. Modern silhouette with iconic Prada styling.",
    "price": 550.00,
    "sku": "PRADA-JACKET-BLACK",
    "images": [],
    "category": "Jackets",
    "attributes": {
      "brand": "Prada",
      "color": "Black",
      "gender": "Men",
      "material": "Nylon",
      "luxury": "Yes"
    },
    "stock": {
      "quantity": 10,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  },
  {
    "id": "39",
    "name": "Gucci GG Marmont Belt - Brown",
    "description": "Iconic designer belt with signature GG buckle. Premium leather and luxury craftsmanship.",
    "price": 590.00,
    "sku": "GUCCI-BELT-BROWN",
    "images": [],
    "category": "Accessories",
    "attributes": {
      "brand": "Gucci",
      "color": "Brown",
      "gender": "Unisex",
      "material": "Leather",
      "style": "Luxury"
    },
    "stock": {
      "quantity": 15,
      "inStock": true
    },
    "syncStatus": "pending",
    "createdAt": "2026-03-28T10:00:00Z"
  }
];

const data = {
  products,
  syncLogs: [],
  categories: []
};

const dataDir = path.join(__dirname, '../data');
const filePath = path.join(dataDir, 'products.json');

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`✅ Products file updated with ${products.length} clothing items`);
