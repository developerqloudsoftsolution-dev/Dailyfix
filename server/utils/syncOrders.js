import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

export const syncAllOrdersAcrossDatabases = async (connection) => {
  try {
    const admin = connection.db.admin();
    const dbsList = await admin.listDatabases();
    const targetDbName = 'dailyfixcare';
    const targetDb = connection.useDb(targetDbName);
    const targetOrdersCol = targetDb.collection('orders');

    console.log('🔄 Checking all databases for orders to sync into', targetDbName, '...');

    const candidateDbNames = ['test', 'Daily', 'dailyfix', 'Dailyfix', 'DailyFI', 'daily'];

    let syncedCount = 0;
    for (const dbInfo of dbsList.databases) {
      if (dbInfo.name === targetDbName) continue;
      if (!candidateDbNames.includes(dbInfo.name) && !dbInfo.name.toLowerCase().includes('daily') && dbInfo.name !== 'test') continue;

      const sourceDb = connection.useDb(dbInfo.name);
      const sourceCollections = await sourceDb.db.listCollections().toArray();
      const hasOrders = sourceCollections.some(c => c.name === 'orders');

      if (hasOrders) {
        const sourceOrders = await sourceDb.collection('orders').find().toArray();
        console.log(`📦 Found ${sourceOrders.length} orders in database '${dbInfo.name}'`);

        for (const order of sourceOrders) {
          const exists = await targetOrdersCol.findOne({
            $or: [
              { _id: order._id },
              { orderId: order.orderId }
            ]
          });

          if (!exists) {
            await targetOrdersCol.insertOne(order);
            syncedCount++;
            console.log(`   ➕ Synced order ${order.orderId || order._id} from '${dbInfo.name}' to '${targetDbName}'`);
          }
        }
      }
    }

    const totalOrdersInTarget = await targetOrdersCol.countDocuments();
    console.log(`✅ Orders sync check completed. Total orders in '${targetDbName}': ${totalOrdersInTarget} (New synced: ${syncedCount})`);
  } catch (err) {
    console.warn('⚠️ Order sync check skipped or notice:', err.message);
  }
};
