"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Project = {
  _id: string;
  name: string;
  description: string;
  billing_rate: number;
  status: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

const EditProjectPage = () => {
  const params = useParams();
  const projectId = params.id;
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    billing_rate: 0,
    status: "",
    archived: false,
  });

  // Fetch single project
  const fetchProject = async () => {
    try {
      const { data } = await axiosInstance.get(`/projects/${projectId}`);
      if (data.success) {
        setProject(data.project);
        setForm({
          name: data.project.name,
          description: data.project.description,
          billing_rate: data.project.billing_rate,
          status: data.project.status,
          archived: data.project.archived,
        });
      }
    } catch (err) {
      console.error("Error fetching project", err);
      toast.error("Failed to fetch project");
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

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
      const { data } = await axiosInstance.put(
        `/projects/update/${projectId}`,
        form
      );
      if (data.success) {
        toast.success("Project updated successfully!");
        router.push(`/admin/projects/${projectId}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  if (!project)
    return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card className="bg-neutral-900 text-white border border-neutral-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Project</CardTitle>
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
              {loading ? "Updating..." : "Update Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProjectPage;
