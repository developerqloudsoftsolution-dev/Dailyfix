console.log("🚀 Starting server...");
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables first
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

// Database
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';

// Routes
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import instagramRoute from "./routes/instagram.js";

const app = express();

// Important for Hostinger reverse proxy
app.set('trust proxy', 1);

// ===============================
// RATE LIMITER
// ===============================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// ===============================
// SECURITY
// ===============================
app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// ===============================
// BODY PARSER
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// COOKIES
// ===============================
app.use(cookieParser());

// ===============================
// UPLOADS
// ===============================
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ===============================
// API ROUTES
// ===============================
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/instagram", instagramRoute);
// ===============================
// FRONTEND (dist folder serving)
//   Supports 3 paths, checked in this order:
//   1. FRONTEND_DIST_PATH from .env (absolute or relative — for deployed servers)
//   2. ../client/dist               (local dev, default XAMPP structure)
//   3. ./dist                       (server-folder-only deployments e.g. upload dist/ into server/)
// ===============================
const projectRoot = path.join(__dirname, '..');
const envPath = process.env.FRONTEND_DIST_PATH;

let frontendPath;
if (envPath && envPath.trim()) {
  frontendPath = path.isAbsolute(envPath)
    ? envPath
    : path.resolve(projectRoot, envPath);
} else {
  const adjacentClientDist = path.join(__dirname, '..', 'client', 'dist');
  const serverInternalDist = path.join(__dirname, 'dist');
  frontendPath = fs.existsSync(adjacentClientDist)
    ? adjacentClientDist
    : serverInternalDist;
}

const frontendExists = fs.existsSync(frontendPath) &&
  fs.existsSync(path.join(frontendPath, 'index.html'));

if (frontendExists) {
  app.use(express.static(frontendPath));

  app.get(/^\/(?!api|uploads).*/, (req, res) => {
    res.sendFile(
      path.join(frontendPath, 'index.html')
    );
  });

  console.log('✅ Frontend dist folder found at:', frontendPath);
} else {
  console.log(
    '⚠️  Frontend dist folder not found at:', frontendPath
  );
  if (envPath) {
    console.log(
      '⚠️  FRONTEND_DIST_PATH is set to:', envPath
    );
  }
  console.log(
    '⚠️  Option 1 (local):  cd client && npm run build   (creates client/dist)'
  );
  console.log(
    '⚠️  Option 2 (deploy): copy client/dist/* into   server/dist/'
  );
  console.log(
    '⚠️  Option 3 (deploy): set FRONTEND_DIST_PATH in .env to the absolute folder path'
  );
  console.log(
    '⚠️  Only API routes will work until dist exists.'
  );
}

// ===============================
// START SERVER FIRST
// ===============================
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Port: ${PORT}`);
  }
);

// ===============================
// CONNECT DATABASE AFTER SERVER STARTS
// ===============================
connectDB()
  .then(async () => {
    console.log('✅ Database connected successfully');

    const ensureAdmin = async (email, plainPassword, label) => {
      try {
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const existing = await Admin.findOne({ email });
        if (!existing) {
          await Admin.create({ email, password: hashedPassword });
          console.log(`✅ ${label} created: ${email} / ${plainPassword}`);
          return;
        }
        const matches = await bcrypt.compare(plainPassword, existing.password);
        if (!matches) {
          existing.password = hashedPassword;
          await existing.save();
          console.log(`🔄 ${label} password reset: ${email} / ${plainPassword}`);
        } else {
          console.log(`ℹ️  ${label} ready: ${email}`);
        }
      } catch (err) {
        console.error(`⚠ ${label} seed failed for ${email}:`, err.message);
      }
    };

    try {
      const envAdminEmail = process.env.ADMIN_EMAIL;
      const envAdminPass = process.env.ADMIN_PASSWORD;
      if (envAdminEmail && envAdminPass) {
        await ensureAdmin(envAdminEmail, envAdminPass, 'Env Admin');
      }
      await ensureAdmin('orders@dailyfixcare.com', 'Orders@123', 'Dailyfix Orders Admin');
    } catch (seedError) {
      console.error('⚠ Admin seeding failed:', seedError.message);
    }
  })
  .catch((error) => {
    console.error(
      '❌ Database connection failed:',
      error.message
    );
  });

// ===============================
// ERROR HANDLING
// ===============================
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error);
});