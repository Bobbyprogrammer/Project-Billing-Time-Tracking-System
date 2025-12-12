"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import axiosInstance from "@/lib/axios";

// Types
interface TimeLog {
  _id?: string;
  hours: number;
  notes: string;
  log_date: string;
  status: "todo" | "in-progress" | "done";
}

export default function TimeLogForm({ log }: { log?: TimeLog }) {
  const router = useRouter();
  const { id: projectId } = useParams();

  const [formData, setFormData] = useState<TimeLog>({
    hours: 0,
    notes: "",
    log_date: "",
    status: "todo",
  });

  const isEdit = !!log;

  useEffect(() => {
    if (log) {
      setFormData({
        hours: log.hours,
        notes: log.notes,
        log_date: log.log_date.split("T")[0],
        status: log.status,
      });
    }
  }, [log]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && log?._id) {
        await axiosInstance.put(`/timelogs/logs/${log._id}`, formData);
      } else {
        const { data } = await axiosInstance.post(
          `/timelogs/projects/${projectId}/logs`,
          formData
        );
      }

      router.push(`/admin/projects/${projectId}`);
      router.refresh();
    } catch (err) {
      console.error("Error saving time log:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto  bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-semibold ">
        {isEdit ? "Edit Time Log" : "Create New Time Log"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hours */}
        <div>
          <Label>Hours *</Label>
          <Input
            type="number"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            required
            step="0.1"
            min="0.1"
            className="mt-1"
          />
        </div>

        {/* Notes */}
        <div>
          <Label>Notes</Label>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="mt-1"
          />
        </div>

        {/* Log Date */}
        <div>
          <Label>Log Date *</Label>
          <Input
            type="date"
            name="log_date"
            value={formData.log_date}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        {/* Status */}
        <div>
          <Label>Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value: any) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button variant={"outline"} className="cursor-pointer" type="submit">
            {isEdit ? "Update Log" : "Create Log"}
          </Button>
        </div>
      </form>
    </div>
  );
}
