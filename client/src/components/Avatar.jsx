import React from "react";

// Curated list of vibrant high-contrast gradient pairs with inline fallback
const PALETTES = [
  { bg: "linear-gradient(135deg, #10b981, #0d9488)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #3b82f6, #4f46e5)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #8b5cf6, #7c3aed)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #f59e0b, #ea580c)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #f43f5e, #db2777)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #06b6d4, #2563eb)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #14b8a6, #059669)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #6366f1, #9333ea)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #d946ef, #e11d48)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #0284c7, #4338ca)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #f97316, #dc2626)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #7c3aed, #4338ca)", text: "#ffffff" },
];

const getPaletteForName = (name = "") => {
  const clean = String(name || "").trim().toUpperCase();
  if (!clean) return PALETTES[0];
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
};

const getInitial = (name = "") => {
  const clean = String(name || "").trim();
  if (!clean) return "U";
  return clean.charAt(0).toUpperCase();
};

export default function Avatar({
  name = "User",
  size = "md",
  className = "",
  showTwoLetters = false,
}) {
  const getInitialsText = () => {
    const clean = String(name || "").trim();
    if (!clean) return "U";
    if (showTwoLetters) {
      const parts = clean.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return clean.slice(0, 2).toUpperCase();
    }
    return getInitial(clean);
  };

  const text = getInitialsText();
  const palette = getPaletteForName(name);

  const sizeClasses = {
    xs: "w-7 h-7 text-xs font-semibold",
    sm: "w-8 h-8 text-xs font-bold",
    md: "w-10 h-10 text-sm font-bold",
    lg: "w-11 h-11 text-base font-bold",
    xl: "w-14 h-14 text-xl font-bold",
    "2xl": "w-16 h-16 text-2xl font-extrabold",
  };

  const appliedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full shadow-sm ring-1 ring-white/20 flex-shrink-0 select-none ${appliedSize} ${className}`}
      style={{
        background: palette.bg,
        color: palette.text,
      }}
      title={typeof name === "string" ? name : "User"}
      aria-label={typeof name === "string" ? name : "User"}
    >
      <span className="leading-none tracking-tight">{text}</span>
    </div>
  );
}
