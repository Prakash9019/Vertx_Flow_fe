import React from "react";
import { RichText } from "../RichText";

export function defaultProblemContent() {
  return { heading: "The Problem", body: "<p>Describe the problem your customers face.</p>" };
}

export function ProblemLayout({ content, onChangeContent }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 sm:p-16">
      <RichText
        as="h1"
        className="text-5xl font-bold text-center"
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <RichText
        as="div"
        className="mt-8 text-xl opacity-80 max-w-3xl text-left"
        toolbarButtons={["bold", "italic", "underline", "fontSize", "textColor", "backgroundColor", "formatUL", "formatOL"]}
        value={content.body}
        onChange={(html) => onChangeContent({ body: html })}
      />
    </div>
  );
}
