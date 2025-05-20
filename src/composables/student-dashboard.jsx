import { useQuery } from "@tanstack/react-query";
import studentDashboard from "../services/api/student-dashboard";
import job from "../services/api/job";
export const useJobStatistics = () => {
  return useQuery({
    queryKey: ["jobStatistics"],
    queryFn: () => studentDashboard.getJobStatistics(),
    refetchOnWindowFocus: false,
  });
};

export const useEventStatistics = () => {
  return useQuery({
    queryKey: ["eventStatistics"],
    queryFn: () => studentDashboard.getEventStatistics(),
    refetchOnWindowFocus: false,
  });
};

export const useActivity = () => {
  return useQuery({
    queryKey: ["activityStatistics"],
    queryFn: () => studentDashboard.getActivityStatistics(),
    refetchOnWindowFocus: false,
  });
};

export const useJobSaved = () => {
  return useQuery({
    queryKey: ["jobSaved"],
    queryFn: () => job.getJobSaved(),
    refetchOnWindowFocus: false,
  });
};
