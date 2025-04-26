import { keepPreviousData, useQuery } from "@tanstack/react-query";
import reaction from "../services/api/reaction";

export const useGetReactionByPostId = (postId) => {
  return useQuery({
    queryKey: ["reactionPostId", postId],
    queryFn: () => reaction.getReactionByPostId(postId),
    placeholderData: keepPreviousData,
    enabled: false,
  });
};

export const useGetCountReactionByPostId = (postId) => {
  return useQuery({
    queryKey: ["reactionCount", postId],
    queryFn: () => reaction.getCountReactionByPostId(postId),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: !!postId,
  });
};
