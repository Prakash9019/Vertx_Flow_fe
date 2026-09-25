import React from "react";
import { RichText } from "../RichText";
import { headingFontSize, bodyFontSize } from "../theme/typographyScale";

export function defaultTeamGridContent() {
  return { heading: "Team", members: [{ photoUrl: "", name: "Name", role: "Role" }] };
}

export function TeamGridLayout({ content, onChangeContent }) {
  function updateMember(index, patch) {
    const members = content.members.map((m, i) => (i === index ? { ...m, ...patch } : m));
    onChangeContent({ members });
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
        {content.members.map((member, index) => (
          <div key={index} className="text-center">
            {member.photoUrl ? (
              <img src={member.photoUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto" style={{ backgroundColor: "var(--theme-surface-muted)" }} />
            )}
            <RichText
              as="div"
              className="mt-4 font-semibold"
              style={{ fontFamily: "var(--theme-heading-font)", fontSize: headingFontSize(1) }}
              value={member.name}
              onChange={(html) => updateMember(index, { name: html })}
            />
            <RichText
              as="div"
              className="opacity-70"
              style={{ fontFamily: "var(--theme-body-font)", fontSize: bodyFontSize(1) }}
              value={member.role}
              onChange={(html) => updateMember(index, { role: html })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
