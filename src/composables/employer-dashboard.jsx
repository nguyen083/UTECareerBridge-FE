import { useQuery } from "@tanstack/react-query";
import employerDashboard from "../services/api/employer-dashboard";

export const useEmployerDashboard = () => {
  return useQuery({
    queryKey: ["activity-stats"],
    queryFn: () => employerDashboard.getActivityStats(),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });
};

export const useApplicantRate = () => {
  return useQuery({
    queryKey: ["applicant-rate"],
    queryFn: () => employerDashboard.getApplicantRate(),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });
};
