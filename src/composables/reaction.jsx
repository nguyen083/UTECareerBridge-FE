import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

export const useCreateReaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, reactionType }) =>
      reaction.createReaction(postId, { reactionType }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reactionPostId", "reactionCount"],
      });
    },
  });
};

export const useDeleteReaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => reaction.deleteReaction(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reactionPostId", "reactionCount"],
      });
    },
  });
};

export const useGetReactionByUserId = (postId) => {
  return useQuery({
    queryKey: ["reactionUserId", postId],
    queryFn: () => reaction.getReactionByUserId(postId),
    placeholderData: keepPreviousData,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
