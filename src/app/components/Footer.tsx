import React from "react";
import BodyText from "./BodyText";

export default function Footer() {
  return (
    <div
      style={{
      
        backgroundColor: "#fff",
        color: "#fff",
        paddingTop: "16px",
        paddingBottom: "16px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <BodyText text="Fatec Votorantim" />
        <BodyText text={`© Todos os direitos reservados`} />
      </div>
    </div>
  );
}
