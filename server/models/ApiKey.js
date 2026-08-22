import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    scope: {
      type: String,
      enum: ["read", "write", "read_write"],
      default: "read_write",
      required: true,
    },
    consumerKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    consumerSecretHash: {
      type: String,
      required: true,
    },
    consumerSecretLast4: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
      index: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    callbackUrl: {
      type: String,
      default: "",
    },
    returnUrl: {
      type: String,
      default: "",
    },
    lastAccessAt: {
      type: Date,
      default: null,
    },
    ipWhitelist: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to verify a consumer secret
apiKeySchema.methods.verifySecret = function (plainSecret, crypto) {
  if (!plainSecret || !this.consumerSecretHash) return false;
  const hash = crypto.createHash("sha256").update(plainSecret).digest("hex");
  return hash === this.consumerSecretHash;
};

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

export default ApiKey;
