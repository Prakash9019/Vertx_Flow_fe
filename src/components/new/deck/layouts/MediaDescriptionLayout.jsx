import React from "react";
import { RichText } from "../RichText";
import { headingFontSize, bodyFontSize } from "../theme/typographyScale";

export function defaultMediaDescriptionContent() {
  return {
    heading: "Product Overview",
    body: "<p>Describe what you've built.</p>",
    media: { url: "", type: "image" },
    mediaPosition: "left",
  };
}

function MediaColumn({ media }) {
  if (!media.url) {
    return (
      <div
        data-col="media"
        data-testid="media-placeholder"
        className="flex-1 rounded-2xl min-h-[300px] flex items-center justify-center p-6 text-center"
        style={{ backgroundColor: "var(--theme-surface-muted)" }}
      >
        {media.prompt ? (
          <p data-testid="media-prompt-caption" className="text-sm italic opacity-70">
            Suggested image: {media.prompt}
          </p>
        ) : null}
      </div>
    );
  }
  if (media.type === "video") {
    return (
      <div data-col="media" className="flex-1">
        <video src={media.url} controls className="w-full rounded-2xl" />
      </div>
    );
  }
  return (
    <div data-col="media" className="flex-1">
      <img src={media.url} alt="" className="w-full rounded-2xl object-cover" />
    </div>
  );
}

export function MediaDescriptionLayout({ content, onChangeContent }) {
  const textColumn = (
    <div data-col="text" className="flex-1 flex flex-col justify-center">
      <RichText
        as="h2"
        className="text-4xl font-bold"
        style={{ fontFamily: "var(--theme-heading-font)", fontSize: headingFontSize(2.25) }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <RichText
        as="div"
        className="mt-6 text-lg opacity-80"
        style={{ fontFamily: "var(--theme-body-font)", fontSize: bodyFontSize(1.125) }}
        value={content.body}
        onChange={(html) => onChangeContent({ body: html })}
      />
    </div>
  );
  const mediaColumn = <MediaColumn media={content.media} />;

  return (
    <div className="grid place-items-center h-full w-full p-8 sm:p-16">
      <div className="flex gap-10 w-full max-w-6xl items-center">
        {content.mediaPosition === "left" ? mediaColumn : textColumn}
        {content.mediaPosition === "left" ? textColumn : mediaColumn}
      </div>
    </div>
  );
}
