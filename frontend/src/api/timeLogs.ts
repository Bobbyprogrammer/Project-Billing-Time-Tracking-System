import axiosInstance from "@/lib/axios";

export const createTimeLog = async (projectId: string, data: any) => {
  return axiosInstance.post(`/projects/${projectId}/logs`, data);
};

export const updateTimeLog = async (logId: string, data: any) => {
  return axiosInstance.put(`/logs/${logId}`, data);
};

export const deleteTimeLog = async (logId: string) => {
  return axiosInstance.delete(`/logs/${logId}`);
};
