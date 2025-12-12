"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/store/authContext";

type ProfileForm = {
  name: string;
  email: string;
};

const ProfilePage = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.put("/users/update", form);

      if (data.success) {
        setUser(data.user);
        toast("Profile updated successfully!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <Card className="w-[380px] bg-neutral-900 text-white border border-neutral-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Update Profile
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
                placeholder="Your Name"
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

            {/* Submit Button */}
            <Button
              variant={"outline"}
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black cursor-pointer"
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
