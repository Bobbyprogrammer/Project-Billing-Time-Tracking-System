"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md h-screen flex flex-col">
      <div className="p-6 text-xl font-bold border-b">Admin Panel</div>
      <nav className="flex-1 flex flex-col mt-4">
        <Link
          href="/admin/dashboard"
          className="px-6 py-3 hover:bg-gray-100 rounded"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/projects"
          className="px-6 py-3 hover:bg-gray-100 rounded"
        >
          Projects
        </Link>
      </nav>
      <div className="p-6 border-t text-gray-500 text-sm">
        © 2025 Project Tracker
      </div>
    </aside>
  );
}
