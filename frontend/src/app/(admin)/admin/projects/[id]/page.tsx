"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";

import ProjectInfo from "./_components/ProjectInfo";
import KanbanBoard from "./_components/KanbanBoard";
import TimeLogForm from "./_components/TimeLogForm";
import BillingSummary from "./_components/BillingSummary";
import { Button } from "@/components/ui/button";

type Project = {
  _id: string;
  name: string;
  description: string;
  status: string;
  billing_rate: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const { data } = await axiosInstance.get(`/projects/${projectId}`);
      if (data.success) {
        setProject(data.project);
      }
    } catch (err) {
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  if (loading)
    return <div className="text-white text-center mt-10">Loading...</div>;

  if (!project)
    return (
      <div className="text-white text-center mt-10">Project not found</div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* PROJECT INFO */}
      <ProjectInfo project={project} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KANBAN BOARD */}
        <div className="lg:col-span-2">
          <KanbanBoard projectId={projectId as string} />
        </div>

        <div className="">
          {/* TIME LOG FORM */}
          <TimeLogForm />
          {/* BILLING SUMMARY */}
          <BillingSummary projectId={projectId as string} />
        </div>
      </div>
    </div>
  );
}
