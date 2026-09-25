import React from "react";

export function ShapeWidget({ element }) {
  const fill = element.props.fill ?? "var(--theme-accent)";
  const shape = element.props.shape ?? "rectangle";

  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: fill,
        borderRadius: shape === "circle" ? "50%" : shape === "rounded" ? "12%" : 0,
      }}
    />
  );
}
