import React from "react";
import { RichText } from "../RichText";

export function defaultMedia3PointsContent() {
  return {
    heading: "Key Features",
    media: { url: "", type: "image" },
    points: [
      { title: "Feature 1", body: "" },
      { title: "Feature 2", body: "" },
      { title: "Feature 3", body: "" },
    ],
  };
}

export function Media3PointsLayout({ content, onChangeContent }) {
  const visiblePoints = content.points.slice(0, 3);

  function updatePoint(index, patch) {
    const points = content.points.map((p, i) => (i === index ? { ...p, ...patch } : p));
    onChangeContent({ points });
  }

  return (
    <div className="flex flex-col h-full w-full p-8 sm:p-16">
      <RichText
        as="h2"
        className="text-4xl font-bold text-center"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <div className="mt-10 flex gap-8">
        {content.media.url ? (
          <img src={content.media.url} alt="" className="flex-1 rounded-2xl object-cover" />
        ) : (
          <div
            data-testid="media-placeholder"
            className="flex-1 rounded-2xl min-h-[300px] flex items-center justify-center p-6 text-center"
            style={{ backgroundColor: "var(--theme-surface-muted)" }}
          >
            {content.media.prompt ? (
              <p data-testid="media-prompt-caption" className="text-sm italic opacity-70">
                Suggested image: {content.media.prompt}
              </p>
            ) : null}
          </div>
        )}
        <div className="flex-1 flex flex-col gap-6">
          {visiblePoints.map((point, index) => (
            <div key={index}>
              {point.title ? (
                <RichText
                  as="h3"
                  className="text-xl font-semibold"
                  style={{ fontFamily: "var(--theme-heading-font)" }}
                  value={point.title}
                  onChange={(html) => updatePoint(index, { title: html })}
                />
              ) : null}
              <RichText
                as="p"
                className="opacity-80"
                style={{ fontFamily: "var(--theme-body-font)" }}
                value={point.body}
                onChange={(html) => updatePoint(index, { body: html })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
