"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

const Page = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();
  const fetchProjects = async () => {
    try {
      const { data } = await axiosInstance.get("/projects");

      if (data.success) {
        const activeProjects = data.projects.filter(
          (project: any) =>
            project.status === "active" && project.archived === false
        );

        setProjects(activeProjects);
      }
    } catch (error) {
      console.log("error in fetching projects", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="max-w-4xl w-full mx-auto border border-white rounded-md p-5">
      <h2 className="text-3xl font-bold text-center">Projects</h2>

      <Table className="my-4">
        <TableHeader>
          <TableRow>
            {/* <TableHead></TableHead> */}
            <TableHead>Project Name</TableHead>
            <TableHead className="text-right">Billing Rate</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">View Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>{project.name}</TableCell>
                <TableCell className="text-right">
                  ${project.billing_rate}
                </TableCell>
                <TableCell className="text-right">{project.status}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/projects/${project._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No projects found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
