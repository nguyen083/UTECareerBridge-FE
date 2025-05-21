import { useQuery } from "@tanstack/react-query";
import interview from "../services/api/interview";

export const useListInterviewEmployer = (params) => {
  return useQuery({
    queryKey: ["listInterviewEmployer", params],
    queryFn: () => interview.getListInterviewEmployer(params),
    select: (res) => res.data,
    refetchOnWindowFocus: false,
  });
};

export const useCountInterview = () => {
  return useQuery({
    queryKey: ["countInterview"],
    queryFn: () => interview.countInterview(),
    select: (res) => res.data,
    refetchOnWindowFocus: false,
  });
};

export const useEvaluationsByStudent = (params) => {
  return useQuery({
    queryKey: ["evaluationsByStudent", params],
    queryFn: () => interview.getEvaluationsByStudent(params),
    select: (res) => res.data,
  });
};
