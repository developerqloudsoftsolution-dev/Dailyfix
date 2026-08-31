console.log("🚀 Starting server...");
import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

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

import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import Order from './models/Order.js';
import delhiveryService from './utils/delhivery.js';
import ekartService from './utils/ekart.js';
import bcrypt from 'bcryptjs';


// Routes
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import instagramRoute from "./routes/instagram.js";
import whatsappRoutes from './routes/whatsappRoutes.js';
import apiAuthRoutes from './routes/apiAuthRoutes.js';
import wcRoutes from './routes/wcRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const app = express();

// Important for Hostinger reverse proxy
app.set('trust proxy', 1);

// ===============================
// RATE LIMITER
// ===============================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Allow up to 2000 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Apply rate limiting specifically to /api routes
app.use('/api', apiLimiter);

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
app.use('/api/admin/whatsapp', whatsappRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);

// WooCommerce / Third-Party App Authorization Routes

app.use('/api/auth', apiAuthRoutes);
app.use('/wc-auth/v1', apiAuthRoutes);

// WooCommerce REST API Compatibility Routes
app.use('/wp-json/wc/v3', wcRoutes);
app.use('/api/wc/v3', wcRoutes);

// ===============================
// FRONTEND (dist folder serving)
//   Supports 3 paths, checked in this order:
//   1. FRONTEND_DIST_PATH from .env (absolute or relative — for deployed servers)
//   2. ../client/dist               (local dev, default XAMPP structure)
//   3. ./dist                       (server-folder-only deployments e.g. upload dist/ into server/)
// ===============================
const projectRoot = path.join(__dirname, '..');
const envPath = process.env.FRONTEND_DIST_PATH;

const candidatePaths = [
  envPath ? (path.isAbsolute(envPath) ? envPath : path.resolve(projectRoot, envPath)) : null,
  path.join(projectRoot, 'client', 'dist'),
  path.join(projectRoot, 'dist'),
  path.join(__dirname, 'dist')
].filter(Boolean);


let frontendPath = candidatePaths.find((p) => fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) || candidatePaths[0];
const frontendExists = Boolean(frontendPath && fs.existsSync(path.join(frontendPath, 'index.html')));

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

    const ensureSoleAdmin = async () => {
      try {
        const soleEmail = "admin@dailyfixcare.com";
        let strongPass = (process.env.ADMIN_PASSWORD || "").trim();
        if (!strongPass || strongPass === "Admin@123" || strongPass === "admin@123") {
          strongPass = "DailyFix#Admin@2026!Secured";
        }
        const hashedPassword = await bcrypt.hash(strongPass, 10);

        // Delete all obsolete / other admin accounts
        try {
          await Admin.deleteMany({ email: { $ne: soleEmail } });
        } catch (delErr) {}

        const existing = await Admin.findOne({ email: soleEmail });
        if (!existing) {
          await Admin.create({
            name: "DailyFix Super Admin",
            email: soleEmail,
            password: hashedPassword,
            role: "Super Admin",
            status: "Active",
          });
          console.log(`✅ Sole Admin Account created: ${soleEmail}`);
        } else {
          existing.password = hashedPassword;
          existing.name = "DailyFix Super Admin";
          existing.role = "Super Admin";
          existing.status = "Active";
          await existing.save();
          console.log(`✅ Sole Admin Account synchronized: ${soleEmail}`);
        }
      } catch (err) {
        console.error("⚠ Sole Admin setup error:", err.message);
      }
    };

    try {
      await ensureSoleAdmin();
    } catch (seedError) {
      console.error('⚠ Admin seeding failed:', seedError.message);
    }

    // 📡 Background Courier Live Tracking Auto-Sync (Runs on startup & every 2 minutes)
    const runCourierAutoSync = async () => {
      try {
        const activeOrders = await Order.find({
          $or: [
            { "delhivery.waybill": { $ne: "" } },
            { "ekart.waybill": { $ne: "" } },
          ],
          status: { $nin: ["Delivered", "Cancelled", "Returned"] },
        });

        if (activeOrders.length > 0) {
          console.log(`📡 [Auto-Sync] Checking live courier updates for ${activeOrders.length} active shipments...`);
          for (const order of activeOrders) {
            if (order.carrier === "Ekart" || (!order.delhivery?.waybill && order.ekart?.waybill)) {
              await ekartService.syncTracking(order).catch(() => {});
            } else if (order.delhivery?.waybill) {
              await delhiveryService.syncTracking(order).catch(() => {});
            }
          }
        }
      } catch (syncErr) {
        console.warn("⚠ [Auto-Sync] Courier sync notice:", syncErr.message);
      }
    };

    // Run first sync 5 seconds after startup, then automatically every 2 minutes
    setTimeout(runCourierAutoSync, 5 * 1000);
    setInterval(runCourierAutoSync, 2 * 60 * 1000);


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