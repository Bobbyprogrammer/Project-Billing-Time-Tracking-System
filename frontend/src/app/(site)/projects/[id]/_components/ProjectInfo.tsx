import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectInfo({ project }: any) {
  return (
    <Card className="bg-neutral-900 text-white border border-neutral-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Description:</strong> {project.description}
        </p>
        <p>
          <strong>Billing Rate:</strong> ${project.billing_rate}
        </p>
        <p>
          <strong>Status:</strong> {project.status}
        </p>
        <p>
          <strong>Archived:</strong> {project.archived ? "Yes" : "No"}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(project.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(project.updatedAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
