import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import comment from "../services/api/comment";

export const useGetCommentRootByPostId = (postId, page) => {
  return useQuery({
    queryKey: ["commentsRoot", postId, page],
    queryFn: () =>
      comment.getCommentsRootByPostId(postId, { page: page - 1, size: 10 }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

export const useGetCommentChildrenByCommentId = (commentId, page) => {
  return useQuery({
    queryKey: ["commentsChildren", commentId, page],
    queryFn: () =>
      comment.getCommentChildrenByCommentId(commentId, {
        page: page - 1,
        size: 10,
      }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

export const useCreateComment = () => {
  return useMutation({
    mutationFn: (params) => comment.createComment(params),
  });
};
