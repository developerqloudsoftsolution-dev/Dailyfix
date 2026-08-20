import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Admin from '../server/models/Admin.js';

async function main() {
  try {
    console.log('Connecting to local database...');
    await mongoose.connect('mongodb://127.0.0.1:27017/dailyfixcare');
    const hashedPassword = await bcrypt.hash('Password123', 10);
    const accounts = ['amarvcode', 'amarvcode@gmail.com', 'amarvcode@dailyfixcare.com'];
    
    for (const email of accounts) {
      const existing = await Admin.findOne({ email });
      if (!existing) {
        await Admin.create({ email, password: hashedPassword });
        console.log('✅ Created admin account:', email);
      } else {
        existing.password = hashedPassword;
        await existing.save();
        console.log('🔄 Updated admin account password:', email);
      }
    }
    console.log('All test accounts created successfully with Password: Password123');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin accounts:', err.message);
    process.exit(1);
  }
}

main();
