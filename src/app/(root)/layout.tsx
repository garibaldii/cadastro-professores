import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/sonner";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="font-work-sans bg-gray-200 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;
