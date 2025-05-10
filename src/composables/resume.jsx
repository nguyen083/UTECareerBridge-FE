import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCV, uploadCV } from "../services/apiService";

export const useResume = () => {
  return useQuery({
    queryKey: ["resume"],
    queryFn: () => getAllCV(),
    refetchOnWindowFocus: false,
  });
};
export const useUploadResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values) => uploadCV(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
    },
  });
};
