import React from "react";
import { RichText } from "../RichText";

export function defaultCtaContent() {
  return { heading: "Join Us", body: "<p>Let's build the future together.</p>", buttonLabel: "Get in touch" };
}

export function CtaLayout({ content, onChangeContent }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 text-center">
      <RichText
        as="h1"
        className="text-5xl font-bold"
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <RichText
        as="div"
        className="mt-6 text-xl opacity-80 max-w-2xl"
        value={content.body}
        onChange={(html) => onChangeContent({ body: html })}
      />
      <RichText
        as="div"
        className="mt-10 inline-block px-8 py-3 rounded-full bg-teal-400 text-black font-semibold"
        value={content.buttonLabel}
        onChange={(html) => onChangeContent({ buttonLabel: html })}
      />
    </div>
  );
}
