"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type TimeLog = {
  _id: string;
  hours: number;
  notes: string;
  log_date: string;
  status: "todo" | "in-progress" | "done";
  user_id: any;
};

const STATUSES = ["todo", "in-progress", "done"] as const;

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/timelogs/projects/${projectId}/logs`
      );
      console.log("data", data);
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [projectId]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const fromCol = source.droppableId;
    const toCol = destination.droppableId;

    if (fromCol === toCol) return;

    const updatedLogs = logs.map((log) =>
      log._id === draggableId ? { ...log, status: toCol as any } : log
    );
    setLogs(updatedLogs);

    try {
      await axiosInstance.patch(`/timelogs/logs/${draggableId}/status`, {
        status: toCol,
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading)
    return (
      <div className="text-white text-center mt-10">Loading Kanban...</div>
    );

  const groupedLogs = {
    todo: logs.filter((l) => l.status === "todo"),
    "in-progress": logs.filter((l) => l.status === "in-progress"),
    done: logs.filter((l) => l.status === "done"),
  };

  const handleDelete = async (logId: string) => {
    if (!confirm("Are you sure you want to delete this log?")) return;

    try {
      await axiosInstance.delete(`/timelogs/logs/${logId}`);
      setLogs((prev) => prev.filter((l) => l._id !== logId));

      toast.success("Log deleted successfully");
    } catch (err: any) {
      toast.error("Error deleting log");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {STATUSES.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                className="bg-neutral-900 text-white p-4 rounded-md min-h-[300px] border border-neutral-700"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="text-lg font-bold capitalize mb-3">
                  {status.replace("-", " ")}
                </h2>

                {groupedLogs[status].map((log, index) => (
                  <Draggable key={log._id} draggableId={log._id} index={index}>
                    {(provided) => (
                      <div
                        className="bg-neutral-800 p-3 rounded-md border border-neutral-600 mb-3 shadow-sm"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <p className="text-sm">
                          <b>Hours:</b> {log.hours}
                        </p>
                        <p className="text-xs opacity-80">{log.notes}</p>
                        <p className="text-xs mt-1">
                          {new Date(log.log_date).toLocaleDateString()}
                        </p>
                        <p
                          onClick={() => handleDelete(log._id)}
                          className="text-red-500 cursor-pointer"
                        >
                          Delete
                        </p>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}
