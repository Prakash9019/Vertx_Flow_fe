import React from "react";

export function TimelineWidget({ element }) {
  const items = element.props.items ?? [];
  const color = element.props.color ?? "var(--theme-accent)";

  return (
    <div className="w-full h-full flex items-start">
      {items.map((item, index) => (
        <div key={index} data-timeline-item className="flex-1 min-w-0 flex flex-col items-center text-center px-1">
          <div className="w-full flex items-center">
            <div className="flex-1 h-px" style={{ backgroundColor: index === 0 ? "transparent" : color }} />
            <div data-timeline-marker className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <div className="flex-1 h-px" style={{ backgroundColor: index === items.length - 1 ? "transparent" : color }} />
          </div>
          <div className="text-xs font-semibold mt-1 truncate w-full" style={{ color: "var(--theme-text)" }}>
            {item.label}
          </div>
          {item.date ? (
            <div className="text-[10px] truncate w-full" style={{ color: "var(--theme-text-muted)" }}>
              {item.date}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
