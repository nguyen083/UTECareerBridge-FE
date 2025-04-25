import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import comment from "../services/api/comment";

export const useGetCommentRootByPostId = (postId, page) => {
  return useQuery({
    queryKey: ["commentsRoot", postId, page],
    queryFn: () =>
      comment.getCommentsRootByPostId(postId, { page: page - 1, size: 5 }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

export const useGetCommentChildrenByCommentId = (commentId, params) => {
  return useQuery({
    queryKey: ["commentsChildren", commentId],
    queryFn: () => comment.getCommentChildrenByCommentId(commentId, params),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

export const useCreateComment = () => {
  return useMutation({
    mutationFn: (params) => comment.createComment(params),
  });
};
