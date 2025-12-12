"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/store/authContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
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
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
   
      <Link href="/" className="text-xl font-bold">
        Project Tracker
      </Link>

   
      <div className="flex items-center space-x-4">
        <Link href="/projects" className="hover:text-blue-500">
          Projects
        </Link>

       
        {!user ? (
          <>
            <Link
              href="/auth/login"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Register
            </Link>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>{user.name}</span>
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}`}
                  alt="avatar"
                  className="w-6 h-6 rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="cursor-pointer"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
