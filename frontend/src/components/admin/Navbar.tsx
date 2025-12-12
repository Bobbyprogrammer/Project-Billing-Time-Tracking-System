"use client";

import axiosInstance from "@/lib/axios";
import { useAuth } from "@/store/authContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axiosInstance.get("/users/logout");
      setUser(null);
      router.push("/auth/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-end items-center">
      <span className="mr-4">{user?.name}</span>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
}
