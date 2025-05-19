import { useQuery } from "@tanstack/react-query";
import adminDashboard from "../services/api/admin-dashboard";

export const useStatisticsByCategory = (params) => {
  return useQuery({
    queryKey: ["statistics-by-category", params],
    queryFn: () => adminDashboard.getStatisticsByCategory(params),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });
};

export const useRecentOrders = (params) => {
  return useQuery({
    queryKey: ["recent-orders", params],
    queryFn: () => adminDashboard.getRecentOrders(params),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });
};

export const useJobStatistics = (params) => {
  return useQuery({
    queryKey: ["jobs-statistics", params],
    queryFn: () => adminDashboard.getJobStatistics(params),
    select: (data) => {
      data.data.total =
        data.data.pendingJob + data.data.activeJob + data.data.rejectedJob;
      return data.data;
    },
    refetchOnWindowFocus: false,
  });
};

export const useUserStats = (params) => {
  return useQuery({
    queryKey: ["users-statistics", params],
    queryFn: () => adminDashboard.getUserStats(params),
    select: (data) =>
      data.data.userGrowthResponses.map((item) => ({
        month: item.month + "/" + item.year,
        employerCount: item.employerCount,
        studentCount: item.studentCount,
      })),
    refetchOnWindowFocus: false,
  });
};

export const useStatsTopSkills = (params) => {
  return useQuery({
    queryKey: ["top-requested-skills", params],
    queryFn: () => adminDashboard.getStatsTopSkills(params),
    select: (data) => {
      const total = data.data.reduce((acc, curr) => acc + curr.count, 0);
      return { ...data, total };
    },
    refetchOnWindowFocus: false,
  });
};

export const useTopEmployer = (params) => {
  return useQuery({
    queryKey: ["top-employers", params],
    queryFn: () => adminDashboard.getTopEmployer(params),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });
};

export const useApplicationStats = (params) => {
  return useQuery({
    queryKey: ["application-statistics", params],
    queryFn: () => adminDashboard.getApplicationStats(params),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });
};

export const useForumStats = (params) => {
  return useQuery({
    queryKey: ["forum-statistics", params],
    queryFn: () => adminDashboard.getForumStats(params),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });
};
