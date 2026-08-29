import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { adminAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext.jsx";

// Header title smooth switcher
const HeaderTitle = ({ text, subtext }) => (
  <motion.div
    key={text}
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.25 }}
    className="text-center"
  >
    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
      {text}
    </h1>
    <p className="text-xs text-slate-500 font-normal mt-1">
      {subtext}
    </p>
  </motion.div>
);

function AdminLogin() {
  const [screen, setScreen] = useState("login"); // 'login' | 'sendOtp' | 'verifyOtp' | 'resetPassword'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("success");

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      y: -8,
      transition: { duration: 0.2 },
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    const result = await adminAPI.login(email, password);
    setIsLoading(false);
    if (result.ok) {
      login(result.data.token);
      navigate("/admin");
    } else {
      setMessage(result.data?.message || "Invalid credentials provided");
      setMessageType("error");
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    const result = await adminAPI.sendOtp(email);
    setIsLoading(false);
    if (result.ok) {
      setMessage("Verification code sent to your email address.");
      setMessageType("success");
      setScreen("verifyOtp");
    } else {
      setMessage(result.data?.message || "Failed to send reset code");
      setMessageType("error");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    const result = await adminAPI.verifyOtp(email, otp);
    setIsLoading(false);
    if (result.ok) {
      setMessage("Verification successful. Set your new password.");
      setMessageType("success");
      setScreen("resetPassword");
    } else {
      setMessage(result.data?.message || "Invalid security code");
      setMessageType("error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    if (newPassword !== confirmPassword) {
      setIsLoading(false);
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }
    const result = await adminAPI.resetPassword(email, otp, newPassword);
    setIsLoading(false);
    if (result.ok) {
      setMessage("Password successfully updated!");
      setMessageType("success");
      setTimeout(() => {
        setScreen("login");
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
      }, 1800);
    } else {
      setMessage(result.data?.message || "Password update failed");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 text-slate-800 font-sans antialiased relative px-4 py-12 selection:bg-indigo-500 selection:text-white">
      
      {/* Soft Background Accent Spheres */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        
        {/* Brand Signifier */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-slate-200/60 flex items-center justify-center mb-4 text-indigo-600">
            <ShieldCheck size={26} className="stroke-[1.75]" />
          </div>

          <AnimatePresence mode="wait">
            {screen === "login" && (
              <HeaderTitle
                key="t1"
                text="Welcome Back"
                subtext="Sign in to access your admin dashboard"
              />
            )}
            {screen === "sendOtp" && (
              <HeaderTitle
                key="t2"
                text="Reset Password"
                subtext="Enter your email to receive a recovery code"
              />
            )}
            {screen === "verifyOtp" && (
              <HeaderTitle
                key="t3"
                text="Verify Code"
                subtext={`Enter the code sent to ${email || "your email"}`}
              />
            )}
            {screen === "resetPassword" && (
              <HeaderTitle
                key="t4"
                text="New Password"
                subtext="Create a strong password for your account"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Card Shell */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          
          {/* Status Message Display */}
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div
                  className={`text-xs font-medium py-3 px-3.5 rounded-xl border flex items-center gap-2.5 ${
                    messageType === "success"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle size={16} className="shrink-0 text-rose-600" />
                  )}
                  <span className="leading-snug">{message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Switcher Controller */}
          <AnimatePresence mode="wait">
            
            {/* SCREEN 1: LOGIN */}
            {screen === "login" && (
              <motion.form
                key="login-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Email or Username
                  </label>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="admin@dailyfixcare.com or username"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setScreen("sendOtp");
                        setMessage("");
                      }}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail("orders@dailyfixcare.com");
                      setPassword("Admin@123");
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-xl border border-slate-200/80 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound size={13} className="text-indigo-600" />
                    <span>Auto-fill Default Admin (orders@dailyfixcare.com / Admin@123)</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* SCREEN 2: FORGOT PASSWORD - REQUEST CODE */}
            {screen === "sendOtp" && (
              <motion.form
                key="send-otp-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSendOtp}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Account Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="admin@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <span>Send Recovery Code</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setScreen("login");
                      setMessage("");
                    }}
                    className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back to Sign In
                  </button>
                </div>
              </motion.form>
            )}

            {/* SCREEN 3: VERIFY OTP CODE */}
            {screen === "verifyOtp" && (
              <motion.form
                key="verify-otp-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleVerifyOtp}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block text-center">
                    Security Passcode
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-mono tracking-[0.5em] pl-[0.5em] text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="000000"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading || otp.length < 6}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify Code</span>
                    )}
                  </button>

                  <div className="flex justify-between items-center px-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setScreen("sendOtp");
                        setMessage("");
                      }}
                      className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 transition cursor-pointer"
                    >
                      <ArrowLeft size={13} /> Change Email
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition cursor-pointer disabled:opacity-50"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              </motion.form>
            )}

            {/* SCREEN 4: NEW PASSWORD */}
            {screen === "resetPassword" && (
              <motion.form
                key="reset-password-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    New Password
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-xs text-slate-400 font-medium">
          Protected by Enterprise Security
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;