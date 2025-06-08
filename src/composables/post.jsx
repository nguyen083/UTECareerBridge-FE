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
    refetchOnWindowFocus: false,
  });
};

export const usePostByTopicId = (topicId, params) => {
  return useQuery({
    queryKey: ["postsByTopicId", topicId, params],
    queryFn: () => post.getByTopicId(topicId, params),
    refetchOnWindowFocus: false,
  });
};

export const usePostByUserId = (userId, params) => {
  return useQuery({
    queryKey: ["postsByUserId", userId, params],
    queryFn: () => post.getByUserId(userId, params),
    refetchOnWindowFocus: false,
  });
};

export const useSearchPost = (params) => {
  return useQuery({
    queryKey: ["searchPosts", params],
    queryFn: () => post.getSearch(params),
    refetchOnWindowFocus: false,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => post.createPost(params),
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
    mutationFn: ({ id, params }) => post.updatePost(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "posts" ||
          query.queryKey[0] === "postsByTopicId" ||
          query.queryKey[0] === "searchPosts",
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
