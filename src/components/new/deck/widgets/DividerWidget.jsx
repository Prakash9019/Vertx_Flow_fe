import React from "react";

export function DividerWidget({ element }) {
  const color = element.props.color ?? "var(--theme-border)";
  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full" style={{ height: 2, backgroundColor: color }} />
    </div>
  );
}
