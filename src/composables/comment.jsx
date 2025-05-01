import {
  useMutation,
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
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
    // enabled: false,
  });
};

export const useCreateComment = () => {
  return useMutation({
    mutationFn: (params) => comment.createComment(params),
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, data }) => comment.updateComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["commentsRoot"],
        exact: false,
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => comment.deleteComment(data.commentId),
    onSuccess: (_, data) => {
      // queryClient.invalidateQueries({
      //   queryKey: ["commentsRoot"],
      //   exact: false,
      // });
      queryClient.invalidateQueries({
        queryKey: ["commentsChildren", data.parentCommentId],
        exact: false,
      });
    },
  });
};
