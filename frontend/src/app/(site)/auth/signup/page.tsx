"use client";
import React, { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/store/authContext";

const RegisterPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/users/signup", form);
      toast("Registration successful!");
      setUser(data.user);
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <Card className="w-[380px] bg-neutral-900 text-white border border-neutral-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Create an Account
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="bg-neutral-800 text-white border-neutral-700"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="bg-neutral-800 text-white border-neutral-700"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  className="bg-neutral-800 text-white border-neutral-700"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                variant={"outline"}
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black cursor-pointer"
              >
                {loading ? "Creating Account..." : "Register"}
              </Button>
              <Link href="/auth/login">Login Here</Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RegisterPage;
