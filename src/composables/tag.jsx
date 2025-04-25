import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import tag from "../services/api/tag";

export const useAllTag = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => tag.getTags(),
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => tag.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
