import React from "react";

// Curated list of high-contrast, beautiful gradient color pairs
const GRADIENTS = [
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-violet-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-teal-500 to-emerald-600",
  "from-indigo-500 to-purple-600",
  "from-fuchsia-500 to-pink-600",
  "from-sky-500 to-indigo-600",
  "from-orange-500 to-red-600",
  "from-violet-600 to-indigo-700",
];

const getGradientForName = (name = "") => {
  const clean = String(name || "").trim().toUpperCase();
  if (!clean) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
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
  const gradient = getGradientForName(name);

  const sizeClasses = {
    xs: "w-7 h-7 text-xs",
    sm: "w-8 h-8 text-xs font-bold",
    md: "w-10 h-10 text-sm font-bold",
    lg: "w-11 h-11 text-base font-bold",
    xl: "w-14 h-14 text-xl font-bold",
    "2xl": "w-16 h-16 text-2xl font-extrabold",
  };

  const appliedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white shadow-sm ring-1 ring-black/5 flex-shrink-0 select-none ${appliedSize} ${className}`}
      title={name}
      aria-label={name}
    >
      <span className="leading-none tracking-tight">{text}</span>
    </div>
  );
}
