import React from "react";

interface BodyTextProps {
  text: string;
  color?: "primary" | "secondary"; // cores simuladas
}

export default function BodyText({ text, color = "secondary" }: BodyTextProps) {
  const textColor = color === "primary" ? "#000" : "#666"; // exemplo de cores

  return (
    <p
      style={{
        margin: 0,
        fontSize: "1.1rem",      
        lineHeight: 1.5,
        color: textColor,
      }}
    >
      {text}
    </p>
  );
}
