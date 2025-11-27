"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { ChatBot } from "./ChatBot";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={() => setOpen(!open)}
        className="
          fixed bottom-6 right-6 z-50
          bg-red-600 hover:bg-red-800
          text-white w-14 h-14 rounded-full
          flex items-center justify-center
          shadow-xl transition
          cursor-pointer
        "
      >
        <MessageCircle size={28} />
      </button>

      {open && (
        <div
          ref={chatRef}
          className="
            fixed bottom-24 right-6 z-50 
            w-80 h-[450px]
            bg-white rounded-xl shadow-2xl 
            border border-gray-200
            overflow-hidden
            p-5
          "
        >
          <ChatBot />
        </div>
      )}
    </>
  );
}
