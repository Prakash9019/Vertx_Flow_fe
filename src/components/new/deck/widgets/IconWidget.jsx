import React from "react";
import { Star, Heart, Check, ArrowRight, Circle, Square } from "lucide-react";

const ICONS = { Star, Heart, Check, ArrowRight, Circle, Square };

export function IconWidget({ element }) {
  const Icon = ICONS[element.props.icon] ?? Star;
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ color: element.props.color ?? "var(--theme-accent)" }}>
      <Icon className="w-full h-full" />
    </div>
  );
}
