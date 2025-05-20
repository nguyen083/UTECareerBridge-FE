import { useQuery } from "@tanstack/react-query";
import job from "../services/api/job";

export const useJobDetail = (jobId) => {
  return useQuery({
    queryKey: ["jobDetail", jobId],
    queryFn: () => job.getJobDetail(jobId),
    select: (res) => res.data,
    refetchOnWindowFocus: false,
  });
};
export const useRecruimentAverage = () => {
  return useQuery({
    queryKey: ["rerecruitmentAverage"],
    queryFn: () => job.getRecruimentAverage(),
    select: (res) => res.data,
    refetchOnWindowFocus: false,
  });
};

export const useRecruimentPerformance = () => {
  return useQuery({
    queryKey: ["recruitmentPerformance"],
    queryFn: () => job.getRecruimentPerformance(),
    select: (res) => res.data,
    refetchOnWindowFocus: false,
  });
};

export const useRecommendJob = (userId) => {
  return useQuery({
    queryKey: ["recommendJob", userId],
    queryFn: () => job.getRecommendJob(userId),
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
};
