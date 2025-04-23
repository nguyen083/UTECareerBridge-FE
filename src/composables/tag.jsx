import { useQuery } from "@tanstack/react-query";
import tag from "../services/api/tag";

export const useAllTag = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => tag.getTags(),
  });
};
