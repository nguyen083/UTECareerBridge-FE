import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import forum from "../services/api/forum";

export const useForumActive = (page = 1, size = 12) => {
  return useQuery({
    queryKey: ["forumsActive", page, size],
    queryFn: () => forum.getAllForumActive({ page: page - 1, size }),
    placeholderData: keepPreviousData,
  });
};

export const useAllForum = () => {
  return useQuery({
    queryKey: ["forums"],
    queryFn: () => forum.getAllForum(),
    placeholderData: keepPreviousData,
  });
};

export const useSearchForum = (params) => {
  return useQuery({
    queryKey: ["searchForums", params],
    queryFn: () => forum.searchForum(params),
    placeholderData: keepPreviousData,
  });
};
export const useForumDetail = (id) => {
  return useQuery({
    queryKey: ["forumDetail", id],
    queryFn: () => forum.getDetailById(id),
    placeholderData: keepPreviousData,
  });
};
export const useCreateForumMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => forum.createForum(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["searchForums", "forums", "forumsActive"],
      });
    },
  });
};
export const useUpdateForumMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id, params) => forum.updateForum(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["searchForums", "forums", " forumsActive"],
      });
    },
  });
};
export const useDeleteForumMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => forum.deleteForum(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["searchForums", "forums", " forumsActive"],
      });
    },
  });
};
