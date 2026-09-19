import React from "react";
import { RichText } from "../RichText";

export function defaultTitleContent() {
  return { title: "Title Only", subtitle: "" };
}

export function TitleLayout({ content, onChangeContent }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 sm:p-16 text-center">
      <RichText
        as="h1"
        className="text-7xl font-bold"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.title}
        onChange={(html) => onChangeContent({ title: html })}
      />
      {content.subtitle ? (
        <div data-field="subtitle" className="mt-4">
          <RichText
            as="p"
            className="text-2xl opacity-60"
            style={{ fontFamily: "var(--theme-body-font)" }}
            value={content.subtitle}
            onChange={(html) => onChangeContent({ subtitle: html })}
          />
        </div>
      ) : null}
    </div>
  );
}
