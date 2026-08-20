import Razorpay from "razorpay";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverEnvPath = path.join(__dirname, "..", ".env");
const rootEnvPath = path.join(__dirname, "..", "..", ".env");

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

let instance = null;
let initError = null;

function getInstance() {
  if (instance) return instance;
  if (initError) throw initError;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    initError = new Error(
      "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env. Use Cash on Delivery (COD) for testing."
    );
    initError.code = "RAZORPAY_NOT_CONFIGURED";
    throw initError;
  }

  try {
    instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    return instance;
  } catch (err) {
    initError = err;
    throw err;
  }
}

export function isRazorpayConfigured() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return Boolean(keyId && keySecret);
}

export default new Proxy(
  {},
  {
    get(_target, prop) {
      const rzp = getInstance();
      return typeof rzp[prop] === "function"
        ? rzp[prop].bind(rzp)
        : rzp[prop];
    },
  }
);