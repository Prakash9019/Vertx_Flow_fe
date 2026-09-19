import React from "react";

function ElementContent({ element }) {
  switch (element.type) {
    case "text":
      return <div dangerouslySetInnerHTML={{ __html: element.props.html ?? "" }} />;
    case "image":
      return (
        <img
          src={element.props.src ?? ""}
          alt={element.props.alt ?? ""}
          role="img"
          className="w-full h-full object-cover"
        />
      );
    case "video":
      return <video src={element.props.src ?? ""} className="w-full h-full object-cover" controls={false} />;
    default:
      return <div className="w-full h-full border-2 border-dashed border-white/40" />;
  }
}

export function FreeElementLayer({ elements, onUpdateElement }) {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {sorted.map((element) => (
        <div
          key={element.id}
          data-element-id={element.id}
          data-type={element.type}
          className="absolute pointer-events-auto"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.w}%`,
            height: `${element.h}%`,
            transform: `rotate(${element.rotation}deg)`,
            zIndex: element.zIndex,
          }}
        >
          <ElementContent element={element} />
        </div>
      ))}
    </div>
  );
}
