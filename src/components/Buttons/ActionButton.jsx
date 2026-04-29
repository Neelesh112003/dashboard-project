import React from "react";

export default function ActionButton({
  text,
  icon: Icon,
  onClick,
  color = "#44a83e",
  type = "button",
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 rounded-xl px-6 py-2.5
        text-sm font-semibold text-white
        transition-all duration-200
        hover:opacity-90 active:scale-95
        disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100
        ${className}
      `}
      style={{ backgroundColor: color }}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{text}</span>
    </button>
  );
}