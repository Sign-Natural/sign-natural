// src/components/dashboardUi/shared/TabLink.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function TabLink({
  to,
  icon: Icon,
  label,
  active = false,
  onClick,
  iconOnly = false, // 🔥 NEW (optional)
}) {
  const base =
    "group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium";
  const cls = active
    ? "bg-[#7d4c35] text-white"
    : "text-gray-700 hover:bg-gray-100";

  return (
    <div className="relative group">
      <Link
        to={to}
        onClick={onClick}
        className={`${base} ${cls} ${iconOnly ? "justify-center" : ""}`}
      >
        {Icon && <Icon className="w-5 h-5 shrink-0" />}
        {!iconOnly && <span>{label}</span>}
      </Link>

      {/* Tooltip when in icon-only mode */}
      {iconOnly && (
        <div
          className="
      absolute
      bottom-full
      left-1/2
      -translate-x-1/2
      mb-2
      px-2
      py-1
      rounded
      bg-black
      text-white
      text-xs
      whitespace-nowrap
      opacity-0
      group-hover:opacity-100
      transition
      pointer-events-none
      z-50
      shadow
    "
        >
          {label}
        </div>
      )}
    </div>
  );
}
