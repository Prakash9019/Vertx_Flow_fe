import React from "react";
import { RichText } from "../RichText";
import { headingFontSize, bodyFontSize } from "../theme/typographyScale";

export function defaultMetricsGridContent() {
  return {
    heading: "Metrics & Traction",
    metrics: [
      { value: "0", label: "Metric 1" },
      { value: "0", label: "Metric 2" },
      { value: "0", label: "Metric 3" },
    ],
  };
}

export function MetricsGridLayout({ content, onChangeContent }) {
  function updateMetric(index, patch) {
    const metrics = content.metrics.map((m, i) => (i === index ? { ...m, ...patch } : m));
    onChangeContent({ metrics });
  }

  return (
    <div className="flex flex-col h-full w-full p-8 sm:p-16">
      <RichText
        as="h2"
        className="text-4xl font-bold text-center"
        style={{ fontFamily: "var(--theme-heading-font)", fontSize: headingFontSize(2.25) }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {content.metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <RichText
              as="div"
              className="text-5xl font-bold"
              style={{ fontFamily: "var(--theme-heading-font)", color: "var(--theme-primary)", fontSize: headingFontSize(3) }}
              value={metric.value}
              onChange={(html) => updateMetric(index, { value: html })}
            />
            <RichText
              as="div"
              className="mt-2 opacity-70"
              style={{ fontFamily: "var(--theme-body-font)", fontSize: bodyFontSize(1) }}
              value={metric.label}
              onChange={(html) => updateMetric(index, { label: html })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
