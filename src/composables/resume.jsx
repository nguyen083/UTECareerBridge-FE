import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCV, updateFindjob, uploadCV } from "../services/apiService";
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
export const useCVAnalyzeApplyJob = (jobId, limit) => {
  return useQuery({
    queryKey: ["cvAnalyzeApplyJob", jobId],
    queryFn: () => resumeApi.CVAnalyzeApplyJob(jobId, limit),
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
export const useUpdateFindJob = () => {
  return useMutation({
    mutationFn: (values) => updateFindjob(values),
  });
};
