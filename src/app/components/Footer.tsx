import React from "react";
import BodyText from "./BodyText";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <BodyText text="Fatec Votorantim" />
          <BodyText
            text={`© ${new Date().getFullYear()} Todos os direitos reservados`}
          />
        </div>
      </div>
    </footer>
  );
}
