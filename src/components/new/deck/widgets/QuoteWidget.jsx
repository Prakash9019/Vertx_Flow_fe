import React from "react";

export function QuoteWidget({ element }) {
  const { text = "", author = "", role = "" } = element.props;

  return (
    <div className="w-full h-full flex flex-col justify-center px-4">
      <blockquote className="text-lg italic leading-snug" style={{ color: "var(--theme-text)" }}>
        “{text}”
      </blockquote>
      {(author || role) && (
        <div data-quote-attribution className="mt-2 text-sm" style={{ color: "var(--theme-text-muted)" }}>
          — {author}
          {role ? `, ${role}` : ""}
        </div>
      )}
    </div>
  );
}
