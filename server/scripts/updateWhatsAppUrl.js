import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dailyfixcare';

async function updateUrl() {
  try {
    try {
      await mongoose.connect(mongoUri);
    } catch (e) {
      await mongoose.connect('mongodb://127.0.0.1:27017/dailyfixcare');
    }

    const WhatsAppSettings = mongoose.model(
      'WhatsAppSettings',
      new mongoose.Schema({}, { strict: false })
    );

    const docs = await WhatsAppSettings.find();
    for (const doc of docs) {
      doc.apiUrl = 'https://dailyfix-whatsapp-backend.onrender.com';
      doc.apiKey = 'local-development-key';
      await doc.save();
    }

    console.log('✅ Updated all WhatsAppSettings documents with Render URL: https://dailyfix-whatsapp-backend.onrender.com');
    process.exit(0);
  } catch (err) {
    console.error('Error updating DB:', err.message);
    process.exit(1);
  }
}

updateUrl();
