"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CreateProjectPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    billing_rate: 0,
    status: "active",
    archived: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "billing_rate" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/projects/create", form);
      if (data.success) {
        toast.success("Project created successfully!");
        router.push("/admin/projects");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card className="bg-neutral-900 text-white border border-neutral-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Project Name"
                value={form.name}
                onChange={handleChange}
                required
                className="bg-neutral-800 text-white border-neutral-700"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Project Description"
                value={form.description}
                onChange={handleChange}
                required
                className="bg-neutral-800 text-white border-neutral-700"
              />
            </div>

            {/* Billing Rate */}
            <div className="space-y-2">
              <Label htmlFor="billing_rate">Billing Rate</Label>
              <Input
                id="billing_rate"
                name="billing_rate"
                type="number"
                placeholder="Billing Rate"
                value={form.billing_rate}
                onChange={handleChange}
                required
                className="bg-neutral-800 text-white border-neutral-700"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                name="status"
                type="text"
                placeholder="active / archived"
                value={form.status}
                onChange={handleChange}
                required
                className="bg-neutral-800 text-white border-neutral-700"
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              className="w-full bg-white text-black cursor-pointer"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProjectPage;
