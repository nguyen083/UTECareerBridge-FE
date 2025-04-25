import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import post from "../services/api/post";

export const useAllPost = (params) => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => post.getAllPosts(params),
  });
};

export const usePostDetail = (id) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => post.getById(id),
  });
};

export const usePostByTopicId = (topicId, params) => {
  return useQuery({
    queryKey: ["postsByTopicId", topicId],
    queryFn: () => post.getByTopicId(topicId, params),
  });
};

export const usePostByUserId = (userId, params) => {
  return useQuery({
    queryKey: ["postsByUserId", userId],
    queryFn: () => post.getByUserId(userId, params),
  });
};

export const useSearchPost = (params) => {
  return useQuery({
    queryKey: ["searchPosts", params],
    queryFn: () => post.getSearch(params),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post) => post.createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", "postsByTopicId", "searchPosts"],
      });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post) => post.updatePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", "postsByTopicId", "searchPosts"],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => post.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", "postsByTopicId", "searchPosts"],
      });
    },
  });
};
