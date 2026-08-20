import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import dns from 'dns';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

// Try configuring Google/Cloudflare DNS for MongoDB SRV resolution on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore DNS set errors if environment does not allow it
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory or project root
const serverEnvPath = path.join(__dirname, '..', '.env');
const rootEnvPath = path.join(__dirname, '..', '..', '.env');

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

const DEFAULT_PRODUCTS = [
  {
    name: "Dailyfix Men's Beard Colour – Natural Black",
    slug: 'natural-black',
    description: 'Get a bold, youthful and well-groomed appearance with Dailyfix Natural Black Beard Colour. Premium beard colour designed to provide rich, natural-looking black coverage. Grey beard coverage with smooth, even colour and a clean, polished appearance.',
    price: 450,
    stock: 100,
    sku: 'DF-NB-001',
    brand: 'Dailyfix',
    image: 'natural-black',
    isActive: true,
    weight: 500,
    length: 15,
    width: 10,
    height: 5,
    gstPercentage: 18
  },
  {
    name: "Dailyfix Men's Beard Colour – Black Brown",
    slug: 'black-brown',
    description: 'Get a naturally groomed look with Dailyfix Black Brown Beard Colour for Men. It helps cover grey beard hair while providing rich, even and natural-looking colour. The easy-to-use formula is ideal for regular grooming and gives your beard a smooth, polished finish.',
    price: 450,
    stock: 100,
    sku: 'DF-BB-002',
    brand: 'Dailyfix',
    image: 'black-brown',
    isActive: true,
    weight: 500,
    length: 15,
    width: 10,
    height: 5,
    gstPercentage: 18
  },
  {
    name: "Dailyfix Men's Beard Colour – Dark Brown",
    slug: 'dark-brown',
    description: 'Get a naturally groomed look with Dailyfix Dark Brown Beard Colour for Men. It helps cover grey beard hair while providing rich, even and natural-looking colour. The easy-to-use formula is ideal for regular grooming and gives your beard a smooth, polished finish.',
    price: 450,
    stock: 100,
    sku: 'DF-DB-003',
    brand: 'Dailyfix',
    image: 'dark-brown',
    isActive: true,
    weight: 500,
    length: 15,
    width: 10,
    height: 5,
    gstPercentage: 18
  }
];

const autoSeedProductsIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('🌱 No products found in database. Auto-seeding initial products...');
      await Product.insertMany(DEFAULT_PRODUCTS);
      console.log('✅ Auto-seeded 3 default Dailyfix products successfully.');
    }
  } catch (err) {
    console.warn('⚠️ Auto-seed check skipped or failed:', err.message);
  }
};

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/dailyfixcare';

  if (primaryUri) {
    try {
      console.log('🔄 Connecting to MongoDB (primary URI)...');
      await mongoose.connect(primaryUri, {
        dbName: 'dailyfixcare',
        serverSelectionTimeoutMS: 6000
      });
      console.log('✅ MongoDB connected successfully to primary URI (dailyfixcare)');
      await autoSeedProductsIfEmpty();
      return;
    } catch (error) {
      console.warn(`⚠️ Primary MongoDB connection failed (${error.message}).`);
      if (primaryUri.includes('mongodb+srv://') || primaryUri !== localUri) {
        console.log('🔄 Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/dailyfixcare)...');
      }
    }
  }

  // Fallback to local MongoDB
  try {
    await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log('✅ MongoDB connected successfully to local instance (dailyfixcare)');
    await autoSeedProductsIfEmpty();
  } catch (localError) {
    console.error('❌ MongoDB local fallback connection failed:', localError.message);
    console.error('⚠️ Please ensure MongoDB is running locally on port 27017 or whitelist your IP on MongoDB Atlas.');
  }
};

export default connectDB;
