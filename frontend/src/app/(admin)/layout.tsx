import React from "react";
import "../globals.css";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
export const metadata = {
  title: "Admin Dashboard",
  description: "Project Billing & Time Tracking Admin Dashboard",
};
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />

        {/* Page content */}
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
