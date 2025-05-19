import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCV, uploadCV } from "../services/apiService";
import resumeApi from "../services/api/resume";

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
export const useCVAnalyzeApplyJob = (jobId) => {
  return useQuery({
    queryKey: ["cvAnalyzeApplyJob", jobId],
    queryFn: () => resumeApi.CVAnalyzeApplyJob(jobId),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};
