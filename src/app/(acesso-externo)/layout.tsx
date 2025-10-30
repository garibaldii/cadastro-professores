import React from "react";
import { Toaster } from "@/components/ui/sonner";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      {children}
      <Toaster />
    </main>
  );
};

export default Layout;
