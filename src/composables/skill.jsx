import { useQuery } from "@tanstack/react-query";
import skill from "../services/api/skill";

export const useTopStudentSkill = () => {
  return useQuery({
    queryKey: ["topStudentSkill"],
    queryFn: () => skill.getTopStudentSkill(),
    select: (res) => res.data,
    refetchOnWindowFocus: false,
  });
};

export const useTopSkill = () => {
  return useQuery({
    queryKey: ["topSkill"],
    queryFn: () => skill.getTopSkill(),
    select: (res) => res.data,
    refetchOnWindowFocus: false,
  });
};
