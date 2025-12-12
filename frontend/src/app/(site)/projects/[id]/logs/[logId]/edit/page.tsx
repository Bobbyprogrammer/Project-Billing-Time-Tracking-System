import TimeLogForm from "../../../_components/TimeLogForm";
import axiosInstance from "@/lib/axios";

export default async function EditLogPage({ params }: any) {
  const { logId } = params;

  const { data } = await axiosInstance.get(`/logs/${logId}`);

  return <TimeLogForm log={data.log} />;
}
