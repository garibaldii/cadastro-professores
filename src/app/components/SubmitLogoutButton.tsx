"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";

export default function SubmitLogoutButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className || ""} ${pending ? "opacity-70 cursor-wait" : ""}`}
    >
      {pending ? "Saindo…" : "Logout"}
    </button>
  );
}
