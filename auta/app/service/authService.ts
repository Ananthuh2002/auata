import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface LoginData {
  employeeId: string;
  password: string;
}

// This is a custom hook — must be called inside a React component
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await axios.post("http://localhost:5001/api/login", data);
      return res.data;
    },
  });
};

export const useRequestMutation = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("http://localhost:5001/api/request", data);
      return res;
    },
  });
};

export const useGetRequests = (employeeId?: string) => {
  return useQuery({
    queryKey: ["requests", employeeId],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5001/api/get-requests", {
        params: { employeeID: employeeId },
      });
      return res.data.data || [];
    },
  });
};

export const useUpdateStatus = () => {
  return useMutation({
    mutationFn: async ({id, status}: {id: string, status: string}) => {
      const res = await axios.post("http://localhost:5001/api/update-status", {id, status});
      return res.data;
    },
  });
};
