import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Admin User',
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Manager', 'Support'],
    default: 'Admin',
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Admin', adminSchema);
