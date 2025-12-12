"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BillingSummaryData {
  project_id: string;
  project_name: string;
  billing_rate: number;
  total_hours: number;
  total_amount: number;
  hours_by_user: {
    user_id: string;
    name: string;
    hours: number;
  }[];
  hours_by_date: {
    date: string;
    hours: number;
  }[];
}

export default function BillingSummary({ projectId }: { projectId: string }) {
  const [summary, setSummary] = useState<BillingSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/projects/${projectId}/billing-summary`
      );
      console.log("data", data);

      setSummary(data);
    } catch (err) {
      console.error("Billing Summary Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [projectId]);

  if (loading) return <p className="text-white">Loading billing summary...</p>;
  if (!summary) return <p className="text-white">No billing summary found.</p>;

  return (
    <Card className="bg-neutral-900 text-white border border-neutral-700">
      <CardHeader>
        <CardTitle>Billing Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* TOTALS SECTION */}
        <div className="p-4 rounded bg-neutral-800">
          <p>
            <strong>Total Hours:</strong> {summary.total_hours}
          </p>
          <p>
            <strong>Billing Rate:</strong> ${summary.billing_rate} / hour
          </p>
          <p>
            <strong>Total Amount:</strong>{" "}
            <span className="text-green-400 font-bold">
              ${summary.total_amount}
            </span>
          </p>
        </div>

        {/* HOURS BY USER */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Hours by User</h3>
          <Table className="bg-neutral-800 rounded">
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">User</TableHead>
                <TableHead className="text-white">Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.hours_by_user.map((u) => (
                <TableRow key={u.user_id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* HOURS BY DATE */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Hours by Date</h3>
          <Table className="bg-neutral-800 rounded">
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.hours_by_date.map((d, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
                  <TableCell>{d.hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
