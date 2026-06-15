/**
 * Voice configuration helpers.
 * Maps icon name strings from the API to Lucide React components,
 * and provides color hex values for each Tailwind color key.
 */

import * as LucideIcons from "lucide-react";

/**
 * Get a Lucide icon component by name string.
 * Falls back to HelpCircle if the name isn't found.
 */
export function getIcon(name) {
  if (!name) return LucideIcons.HelpCircle;
  return LucideIcons[name] || LucideIcons.HelpCircle;
}

/**
 * Color key → hex value mapping (matches Tailwind 500 shades).
 */
export const COLOR_HEX = {
  red: "#ef4444",
  green: "#22c55e",
  amber: "#f59e0b",
  blue: "#3b82f6",
  purple: "#a855f7",
};

/**
 * Color key → Tailwind class mappings for UI elements.
 */
export const COLOR_CLASSES = {
  red: {
    accent: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/[0.06]",
    bar: "bg-red-500",
    selectedBorder: "border-red-500/40",
    glow: "shadow-[0_0_16px_rgba(239,68,68,0.15)]",
    iconBg: "bg-red-500/10",
  },
  green: {
    accent: "text-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/[0.06]",
    bar: "bg-green-500",
    selectedBorder: "border-green-500/40",
    glow: "shadow-[0_0_16px_rgba(34,197,94,0.15)]",
    iconBg: "bg-green-500/10",
  },
  amber: {
    accent: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/[0.06]",
    bar: "bg-amber-500",
    selectedBorder: "border-amber-500/40",
    glow: "shadow-[0_0_16px_rgba(245,158,11,0.15)]",
    iconBg: "bg-amber-500/10",
  },
  blue: {
    accent: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/[0.06]",
    bar: "bg-blue-500",
    selectedBorder: "border-blue-500/40",
    glow: "shadow-[0_0_16px_rgba(59,130,246,0.15)]",
    iconBg: "bg-blue-500/10",
  },
  purple: {
    accent: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/[0.06]",
    bar: "bg-purple-500",
    selectedBorder: "border-purple-500/40",
    glow: "shadow-[0_0_16px_rgba(168,85,247,0.15)]",
    iconBg: "bg-purple-500/10",
  },
};
