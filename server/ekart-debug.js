import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverEnvPath = path.join(__dirname, '.env');
const rootEnvPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

console.log('🚀 Dailyfix Ekart Logistics Debug Script');
console.log('='.repeat(70));

// 1. Environment check
console.log('\n📋 Ekart Environment Configuration:');
console.log('  EKART_CLIENT_ID:      ', process.env.EKART_CLIENT_ID ? `✅ SET (${process.env.EKART_CLIENT_ID})` : '❌ NOT SET');
console.log('  EKART_MERCHANT_CODE:  ', process.env.EKART_MERCHANT_CODE ? `✅ SET (${process.env.EKART_MERCHANT_CODE})` : '❌ NOT SET');
console.log('  EKART_CLIENT_SECRET:  ', process.env.EKART_CLIENT_SECRET ? '✅ SET' : '⚠️ NOT SET (Optional for direct token)');
console.log('  EKART_AUTH_TOKEN:     ', process.env.EKART_AUTH_TOKEN ? '✅ SET' : '⚠️ NOT SET (Will use Bearer Client ID)');
console.log('  EKART_BASE_URL:       ', process.env.EKART_BASE_URL || 'Default: https://api.ekartlogistics.com');
console.log('  DEFAULT_CARRIER:      ', process.env.DEFAULT_SHIPPING_CARRIER || 'Delhivery');

const BASE_URL = process.env.EKART_BASE_URL || 'https://api.ekartlogistics.com';
const CLIENT_ID = process.env.EKART_CLIENT_ID || 'EKART_6a8933353d72a44ab9b54f63';

// 2. Test connectivity
const testEkartPing = async () => {
  console.log('\n🔍 Test 1: Testing Ekart Logistics API Connectivity:');
  try {
    const res = await axios.get(`${BASE_URL}`, {
      headers: {
        'Content-Type': 'application/json',
        'HTTP_X_MERCHANT_CODE': CLIENT_ID,
        'Authorization': `Bearer ${process.env.EKART_AUTH_TOKEN || CLIENT_ID}`,
      },
      timeout: 10000,
    });
    console.log('  ✅ Connection to Ekart server reachable! Status:', res.status);
    return true;
  } catch (error) {
    if (error.response) {
      console.log(`  ℹ️ Server responded with HTTP status ${error.response.status} (${error.response.statusText})`);
      console.log(`  Response:`, error.response.data || 'No response body');
    } else {
      console.log('  ⚠️ Ekart API check note:', error.message);
    }
    return false;
  }
};

// 3. Test Pincode Serviceability Format
const testServiceability = async () => {
  console.log('\n📍 Test 2: Checking Sample Ekart Serviceability Request Payload:');
  const samplePayload = {
    source_pincode: process.env.EKART_PICKUP_PIN || '400072',
    destination_pincode: '110001',
    weight: 500,
    payment_type: 'COD',
  };
  console.log('  Sample Request Payload:', JSON.stringify(samplePayload, null, 2));

  try {
    const res = await axios.post(`${BASE_URL}/v1/serviceability`, samplePayload, {
      headers: {
        'Content-Type': 'application/json',
        'HTTP_X_MERCHANT_CODE': CLIENT_ID,
        'Authorization': `Bearer ${process.env.EKART_AUTH_TOKEN || CLIENT_ID}`,
      },
      timeout: 10000,
    });
    console.log('  ✅ Serviceability Response:', res.data);
  } catch (err) {
    console.log('  ℹ️ Serviceability endpoint response:', err.response?.data || err.message);
  }
};

// 4. Run tests
const runAll = async () => {
  await testEkartPing();
  await testServiceability();

  console.log('\n' + '='.repeat(70));
  console.log('✅ Ekart Logistics Configuration Checked!');
  console.log('='.repeat(70));
};

runAll();
