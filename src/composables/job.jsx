import { useQuery } from "@tanstack/react-query";
import job from "../services/api/job";

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
