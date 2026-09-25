import React from "react";

// A hand-rolled bar chart (no charting library - see EDITOR-V2-STATUS.md's
// widget-types entry for why): each bar's height is its value as a
// percentage of the largest value in the data set.
export function ChartWidget({ element }) {
  const data = element.props.data ?? [];
  const color = element.props.color ?? "var(--theme-primary)";
  const max = Math.max(1, ...data.map((d) => Number(d.value) || 0));

  return (
    <div className="w-full h-full flex items-end gap-2 px-2 pb-1">
      {data.map((point, index) => (
        <div key={index} className="flex-1 h-full flex flex-col items-center justify-end min-w-0">
          <div
            data-chart-bar
            className="w-full rounded-t"
            style={{ height: `${((Number(point.value) || 0) / max) * 100}%`, backgroundColor: color }}
          />
          <div
            className="text-[10px] mt-1 truncate w-full text-center"
            style={{ color: "var(--theme-text-muted)" }}
          >
            {point.label}
          </div>
        </div>
      ))}
    </div>
  );
}
